import {uploadChart} from "@/server/actions/chartActions";

export const saveSvgAsImage = async (chartElement: SVGSVGElement | null) => {
    if (chartElement) {
        const svgElement = chartElement.cloneNode(true) as SVGSVGElement;

        svgElement.querySelectorAll('foreignObject').forEach(fo => fo.remove());

        svgElement.querySelectorAll('circle[class*="-dot"]').forEach(circle => {
            (circle as SVGCircleElement).setAttribute('r', '6');
        });

        const hiddenDiv = document.createElement('div');
        hiddenDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;';
        hiddenDiv.appendChild(svgElement);
        document.body.appendChild(hiddenDiv);

        const { x, y, width, height } = svgElement.getBBox();

        svgElement.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
        svgElement.setAttribute('width', `${width}`);
        svgElement.setAttribute('height', `${height}`);

        hiddenDiv.remove();

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        const filePath = await uploadChart(svgString);

        if (filePath) {
            return filePath;
        } else {
            return '';
        }
    }
};
