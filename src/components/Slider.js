import ReactSlider from "react-slider";

const Slider = (props) => {
    const {
        min,
        max,
        defaultValue,
        currentValue,
        setCurrentValue
    } = props;

    return (
        <ReactSlider
          className="customSlider"
          thumbClassName="customSlider-thumb"
          trackClassName="customSlider-track"
          markClassName="customSlider-mark"
          min={min}
          max={max}
          defaultValue={defaultValue}
          value={currentValue}
          onChange={(value) => setCurrentValue(value)}
          renderMark={(props) => {
             if (props.key < currentValue) {
               props.className = "customSlider-mark customSlider-mark-before";
             } else if (props.key === currentValue) {
               props.className = "customSlider-mark customSlider-mark-active";
             }
             return <span {...props} />;
          }}
        />
    );
};

export default Slider;