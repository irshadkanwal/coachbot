"use client";

import React, { useEffect, useState, useRef, forwardRef, useCallback } from 'react';
import * as d3 from 'd3';
import { nanoid } from 'nanoid';

import { useScreenSize } from '@/utils/hooks/use-screen';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import { Area } from '@models/data.models';

const LABEL_COLORS = {
  [Theme.LIGHT]: {
    backgroundColor: '#FFFFFF',
    textColor: '#473F65',
    selectedTextColor: '#FFFFFF',
    greenYellowGradient: {
      from: '#FFFFFF, #FFFFFF',
      to: 'to right, #2FD3A7, #EDA451'
    }
  },
  [Theme.DARK]: {
    backgroundColor: '#040014',
    textColor: '#FFFFFF',
    selectedTextColor: '#0B0033',
    greenYellowGradient: {
      from: '#040014, #040014',
      to: 'to right, #3ABEB8, #F9BE19'
    }
  }
} as const;

interface DataItemWithKey extends Area {
  key: string | null;
  activeDotRadius: number;
  inactiveDotRadius: number;
}

interface RadarChartProps {
  handleClick?: (index: number) => void;
  data: Area[];
  surveySaved?: boolean,
  readonly?: boolean,
  className?: string;
}

const cssIconKeys = ['health', 'family', 'romance', 'growth', 'fun', 'finance', 'business', 'physical'];

export const RadarChart = forwardRef<SVGSVGElement, RadarChartProps>(({ handleClick, data, surveySaved, readonly, className }, ref) => {
  const { innerWidth, lessThenMd } = useScreenSize();
  const { theme } = useTheme();

  const [hideText, setHideText] = useState(false);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const svgRef = ref as React.RefObject<SVGSVGElement | null> ?? useRef<SVGSVGElement | null>(null);
  const uniqueId = useRef<string>(CSS.escape(`id-${nanoid()}`));
  const id = uniqueId.current;

  const findCssIconKey = useCallback((name: string): string | null => {
    const lowerCaseName = name.toLowerCase();

    return cssIconKeys.find(key => lowerCaseName.includes(key)) || null;
  }, []);

  const processData = useCallback((data: Area[], valueKey: 'value' | 'desiredValue'): DataItemWithKey[] => {
    return data.map((item) => ({
      ...item,
      displayName: item.displayName || item.name,
      value: valueKey === 'value' ? item.value : (item.desiredValue || 0),
      key: findCssIconKey(item.name),
      activeDotRadius: valueKey === 'value' ? 13 : item.desiredValue === 0 ? 0 : 10,
      inactiveDotRadius: valueKey === 'value' ? 6 : item.desiredValue === 0 ? 0 : 1,
    }));
  }, []);

  useEffect(() => {
    if (readonly) {
      setHideText(true);
    } else {
      setHideText(lessThenMd);
    }
    return () => { };
  }, [innerWidth, lessThenMd]);

  useEffect(() => {
    const updateSvgWidth = () => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        setSvgHeight(svgRect.height);
        setSvgWidth(svgRect.width);
      }
    };

    updateSvgWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateSvgWidth();
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const dataWithKeys: DataItemWithKey[] = processData(data, 'value');
    const desiredDataWithKeys: DataItemWithKey[] = processData(data, 'desiredValue');

    const svg = d3.select(svgRef.current ?? null)
      .attr('id', id)
      .attr('width', '100%')
      .attr('height', '100%')

    const radius = 125;
    const angleSlice = Math.PI * 2 / dataWithKeys.length;
    const radialScale = d3.scaleLinear().domain([0, 10]).range([0, radius]);
    const fontStyle = '400 14px Helvetica Now Display';
    const translateY = (hideText || svgHeight < 200 || svgHeight > 200) ? svgHeight / 2 : 200;
    const scale = svgWidth < 400 ? (svgHeight < 400 ? svgHeight / 400 : svgWidth / 400) : (svgWidth > 400 ? svgHeight / 400 : 1);

    const { backgroundColor, textColor, selectedTextColor, greenYellowGradient } = LABEL_COLORS[theme];

    const chartGroup = svg.selectAll(`g.${id}-chartGroup`)
      .data([null])
      .join(
        enter => enter.append('g')
          .attr('class', `${id}-chartGroup`)
          .attr('transform', `translate(${svgWidth / 2}, ${translateY}) scale(${scale})`),
        update => update
          .attr('transform', `translate(${svgWidth / 2}, ${translateY}) scale(${scale})`),
        exit => exit.remove()
      );

    chartGroup.selectAll(`circle.${id}-circle`)
      .data(d3.range(1, 11).reverse())
      .join(
        enter => enter.append('circle')
          .attr('class', `${id}-circle`)
          .attr('r', d => radialScale(d))
          .attr('fill', 'none')
          .attr('stroke', '#444')
          .attr('stroke-width', 0.5),
        update => update,
        exit => exit.remove()
      );

    const generateSegments = (data: DataItemWithKey[]): DataItemWithKey[][] => {
      const segments: DataItemWithKey[][] = [];
      let segment: DataItemWithKey[] = [];

      data.forEach(d => {
        if (d.value !== 0) {
          segment.push(d);
        } else if (segment.length) {
          segments.push(segment);
          segment = [];
        }
      });

      if (segment.length) segments.push(segment);
      if (data[0].value !== 0 && data[data.length - 1].value !== 0) {
        segments.push([data[data.length - 1], data[0]]);
      }

      return segments;
    };

    const renderPath = (
      segments: DataItemWithKey[][],
      className: string,
      color: string,
      dataWithKeys: DataItemWithKey[]
    ) => {
      chartGroup.selectAll(`path.${id}-path-${className}`)
        .data(segments)
        .join(
          enter => enter.append('path')
            .attr('class', `${id}-path-${className}`)
            .attr('d', d3.lineRadial<DataItemWithKey>()
              .angle(d => {
                const idx = dataWithKeys.indexOf(d);
                return idx * angleSlice;
              })
              .radius(d => radialScale(d.value || 0))
              .curve(d3.curveLinear)
            )
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 2),
          update => update
            .attr('d', d3.lineRadial<DataItemWithKey>()
              .angle(d => {
                const idx = dataWithKeys.indexOf(d);
                return idx * angleSlice;
              })
              .radius(d => radialScale(d.value || 0))
              .curve(d3.curveLinear)
            ),
          exit => exit.remove()
        );
    };

    const addAxis = () => {
      chartGroup.selectAll(`.${id}-axis`)
        .data(dataWithKeys)
        .join(
          enter => enter.append('g')
            .attr('class', `${id}-axis`)
            .call(g => g.append('line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', (d, i) => {
                const angle = (angleSlice * i) - Math.PI / 2;
                return radialScale(10) * Math.cos(angle);
              })
              .attr('y2', (d, i) => {
                const angle = (angleSlice * i) - Math.PI / 2;
                return radialScale(10) * Math.sin(angle);
              })
              .attr('stroke', '#444')
              .attr('stroke-width', 0.5)
            ),
          update => update,
          exit => exit.remove()
        );
    };

    const generateDots = (data: DataItemWithKey[], className: string, color: string) => {
      return chartGroup.selectAll(`circle.${id}-${className}-dot`)
        .data(data)
        .join(
          enter => enter.append('circle')
            .attr('class', `${id}-${className}-dot`)
            .attr('data-key', d => d.key)
            .attr('cx', (d, i) => calculateCx(d, i))
            .attr('cy', (d, i) => calculateCy(d, i))
            .attr('r', d => d.active ? d.activeDotRadius : d.inactiveDotRadius)
            .attr('fill', color)
            .style('cursor', 'pointer')
            .style('z-index', '10'),
          update => update
            .attr('cx', (d, i) => calculateCx(d, i))
            .attr('cy', (d, i) => calculateCy(d, i))
            .attr('r', d => d.active ? d.activeDotRadius : d.inactiveDotRadius)
            .attr('fill', color)
            .style('cursor', 'pointer')
            .style('z-index', '10'),
          exit => exit.remove()
        );
    };

    const desiredValueSegments: DataItemWithKey[][] = generateSegments(desiredDataWithKeys);
    const valueSegments: DataItemWithKey[][] = generateSegments(dataWithKeys);

    addAxis();

    renderPath(desiredValueSegments, 'desired', '#F1C201', desiredDataWithKeys);
    renderPath(valueSegments, 'value', '#33B3A9', dataWithKeys);

    generateDots(desiredDataWithKeys, "desired", '#F1C201');
    generateDots(dataWithKeys, "value", '#33B3A9');

    chartGroup.selectAll(`foreignObject.${id}-label`)
      .data(dataWithKeys)
      .join(
        enter => {
          const label = enter.append('foreignObject')
            .attr('class', `${id}-label`)
            .attr('data-key', d => d.key)
            .attr('x', (d, i) => calculateLabelX(d, i))
            .attr('y', (d, i) => calculateLabelY(d, i))
            .attr('width', d => calculateTextWidth(`${d.displayName}`, fontStyle) + 33)
            .attr('height', 50);

          const div = label.append('xhtml:div')
            .attr('class', `${id}-label-content`)
            .style('display', 'inline-block')
            .style('padding', '10px 15px')
            .style('background', d => d.active ? 'linear-gradient(to right, #4AB38D, #DBA91B)' : backgroundColor)
            .style('border', '1px solid transparent')
            .style('border-radius', '20px')
            .style('font-size', '14px')
            .style('color', d => (d.active || d.value > 0) ? textColor : '#B6B6B6')
            .style('white-space', 'nowrap')
            .style('cursor', 'pointer')
            .html(d => `
              <div style="display: flex; align-items: center;">
                <i class="cbi-${d.key}" style="font-size: 19px;"></i>
                <span style="padding-left: 5px; ${hideText ? "display: none" : ''}" > ${d.displayName}</span>
              </div>
            `);

          div.on('mouseenter', function (event, d) {
            if (!d.active) {
              highlightLabelAndDot(d, true, 'value');
            }
          })
            .on('mouseleave', function (event, d) {
              if (!d.active) {
                highlightLabelAndDot(d, false, 'value');
              }
            })
            .on('click', function (event, d) {
              const index = dataWithKeys.findIndex(item => item.key === d.key);
              if (handleClick) {
                handleClick(index);
              }
            });

          return label;
        },
        update => {
          update.attr('x', (d, i) => calculateLabelX(d, i))
            .attr('y', (d, i) => calculateLabelY(d, i))
            .select(`div.${id}-label-content`)
            .style('display', 'inline-block')
            .style('padding', '10px 15px')
            .style('background', d => d.active ? 'linear-gradient(to right, #4AB38D, #DBA91B)' : backgroundColor)
            .style('border', '1px solid transparent')
            .style('border-radius', '20px')
            .style('font-size', '14px')
            .style('color', d => (d.active || d.value > 0) ? textColor : '#B6B6B6')
            .style('white-space', 'nowrap')
            .style('cursor', d => (!d.active && surveySaved) ? 'pointer' : 'default')
            .html(d => `
              <div style="display: flex; align-items: center;">
                <i class="cbi-${d.key}" style="font-size: 19px;"></i>
                <span style="padding-left: 5px; ${hideText ? "display: none" : ''}" > ${d.displayName}</span>
              </div>
            `)
            .on('mouseenter', function (event, data) {
              if ((!data.active && surveySaved) || readonly) {
                const desiredData = desiredDataWithKeys.find(({ id }) => id === data.id) || data;

                highlightLabelAndDot(desiredData, true, 'desired');
                highlightLabelAndDot(data, true, 'value');
              }
            })
            .on('mouseleave', function (event, data) {
              if ((!data.active && surveySaved) || readonly) {
                const desiredData = desiredDataWithKeys.find(({ id }) => id === data.id) || data;

                highlightLabelAndDot(desiredData, false, 'desired');
                highlightLabelAndDot(data, false, 'value');
              }
            })
            .on('click', function (event, d) {
              const index = dataWithKeys.findIndex(item => item.key === d.key);
              if (handleClick) {
                handleClick(index);
              }
            });

          return update;
        },
        exit => exit.remove()
      );


    const handleDotEvents = (dotClass: string) => {
      const selection = chartGroup.selectAll(`circle.${id}-${dotClass}-dot`);

      selection.on('mouseenter', function (event: any, d: any) {
        if ((!d.active && surveySaved) || readonly) {
          highlightLabelAndDot(d, true, dotClass);
        }
      })
        .on('mouseleave', function (event: any, d: any) {
          if ((!d.active && surveySaved) || readonly) {
            highlightLabelAndDot(d, false, dotClass);
          }
        })
        .on('click', function (event: any, d: any) {
          const index = dataWithKeys.findIndex(item => item.key === d.key);
          if (handleClick) {
            handleClick(index);
          }
        });
    }

    handleDotEvents('value');
    handleDotEvents('desired');

    function highlightLabelAndDot(d: DataItemWithKey, highlight: boolean, dotClass: string) {
      const selectedDot = d3.select(`circle.${id}-${dotClass}-dot[data-key='${d.key}']`);
      const labelText = d3.select(`foreignObject.${id}-label[data-key='${d.key}']`);

      if (!selectedDot.empty()) {
        const cx = selectedDot.attr('cx') as unknown as number;
        const cy = selectedDot.attr('cy') as unknown as number;

        if (highlight) {
          selectedDot.transition().attr('r', d.activeDotRadius);
          labelText.select('div')
            .style('border', '1px solid transparent')
            .style('background', `linear-gradient(${greenYellowGradient.from}) padding-box, linear-gradient(${greenYellowGradient.to}) border-box`)
            .style('color', textColor);

          readonly && labelText.selectAll('span').style('display', 'inline-block');
          if (!d3.select(`text.${id}-${dotClass}-text[data-key='${d.key}']`).node()) {
            d3.selectAll(`text.${id}-${dotClass}-text`).remove();
            chartGroup.append('text')
              .attr('class', `${id}-${dotClass}-text`)
              .attr('data-key', d.key)
              .attr('x', cx)
              .attr('y', cy)
              .attr('dy', '0.15em')
              .attr('dx', '0em')
              .attr('fill', selectedTextColor)
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
              .attr('font-weight', 'bold')
              .style('pointer-events', 'none')
              .style('font-size', `14px`)
              .text(d.value === 0 ? 0 : d.value);
          }
        } else {
          selectedDot.transition().attr('r', d.inactiveDotRadius);
          labelText.select('div')
            .style('border', '1px solid transparent')
            .style('background', '')
            .style('background-color', backgroundColor)
            .style('color', d.value > 0 ? textColor : '#B6B6B6');
          labelText.selectAll('svg path').style('stroke', '#727379');
          readonly && labelText.selectAll('span').style('display', 'none');
          d3.selectAll(`text.${id}-${dotClass}-text`).remove();
        }
      } else {
        console.error(`Element with class .${id}-dot[data-key='${d.key}'] not found`);
      }
    }

    function calculateTextWidth(text: string, font: string) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get 2D context');
      }

      context.font = font;
      return context.measureText(text).width + 35;
    }

    function calculateCx(d: DataItemWithKey, i: number) {
      if (d.value === 0) return radialScale(0);
      const angle = (angleSlice * i) - Math.PI / 2;
      return radialScale(d.value) * Math.cos(angle);
    }

    function calculateCy(d: DataItemWithKey, i: number) {
      if (d.value === 0) return radialScale(0);
      const angle = (angleSlice * i) - Math.PI / 2;
      return radialScale(d.value) * Math.sin(angle);
    }

    function calculateLabelX(d: DataItemWithKey, i: number) {
      const angle = (angleSlice * i) - Math.PI / 2;
      const labelWidth = calculateTextWidth(`${d.displayName}`, fontStyle) + 33;
      const offset = hideText ? 25 : labelWidth / 2;
      const scale = hideText ? 13 : 20;
      return radialScale(scale) * Math.cos(angle) - offset;
    }

    function calculateLabelY(d: DataItemWithKey, i: number) {
      const angle = (angleSlice * i) - Math.PI / 2;
      const offset = hideText ? 20 : 20;
      const scale = hideText ? 13 : 13;
      return radialScale(scale) * Math.sin(angle) - offset;
    }

    dataWithKeys.forEach(d => {
      if (d.active) {
        const labelText = d3.select(`foreignObject.${id}-label[data-key='${d.key}']`);
        labelText.select('div')
          .style('background', `linear-gradient(${greenYellowGradient.to})`)
          .style('border', 'none')
          .style('color', selectedTextColor)
          .style('padding', '10px 15px');
        labelText.selectAll('svg path').style('stroke', '#000000');
        const selectedDot = d3.select(`circle.${id}-value-dot[data-key='${d.key}']`);
        selectedDot.attr('r', d.activeDotRadius);
      }
    });
    return () => { };
  }, [data, hideText, svgWidth, surveySaved, theme]);

  return (
    <svg className={className} ref={svgRef}></svg>
  );
});

RadarChart.displayName = 'RadarChart';
