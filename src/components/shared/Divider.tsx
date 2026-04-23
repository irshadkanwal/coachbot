export interface DividerProps {
    /**
     * The title of the divider ( 'Or' by default )
     */
    title?: string;
    /**
     * The color of the divider ( storm-gray by default )
     */
    color?: string;
  }
  
  /**
   * A divider component to separate content with a title and a lines on both sides
   */
  export function Divider({ title = "Or", color = "storm-gray" }: DividerProps) {
    return (
      <div className="flex items-center gap-4 my-4">
        <div className={`h-px flex-1 bg-${color}`} />
        <span className={`text-${color}`}>{title}</span>
        <div className={`h-px flex-1 bg-${color}`} />
      </div>
    );
  }
  