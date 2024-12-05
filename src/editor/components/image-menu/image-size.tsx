type ImageSizeProps = {
  value: number;
  onValueChange: (value: number) => void;
  dimension: 'width' | 'height';
};

export function ImageSize(props: ImageSizeProps) {
  const { value, onValueChange, dimension } = props;

  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) {
      onValueChange(0);
    } else if (numValue > 600) {
      onValueChange(600);
    } else {
      onValueChange(numValue);
    }
  };

  return (
    <label className="mly-relative mly-flex mly-items-center">
      <span className="mly-absolute mly-inset-y-0 mly-left-2 mly-flex mly-items-center mly-text-xs mly-leading-none mly-text-gray-400">
        {dimension === 'width' ? 'W' : 'H'}
      </span>
      <input
        className="hide-number-controls mly-h-auto mly-max-w-20 mly-appearance-none mly-border-0 mly-border-none mly-p-1 mly-px-[26px] mly-text-sm mly-uppercase mly-tabular-nums mly-outline-none focus-visible:mly-outline-none"
        type="number"
        value={value || '100%'}
        onChange={(e) => handleChange(e.target.value)}
        max="600"
      />
      <span className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center mly-text-xs mly-leading-none mly-text-gray-400">
        PX
      </span>
    </label>
  );
}
