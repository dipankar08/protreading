import { TProps } from "../libs/types";

export const DTextArea = ({ onChange }: TProps) => {
  return (
    <textarea
      style={{ border: "2px solid black", height: 50, outline: "none" }}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
    ></textarea>
  );
};

export const DButton = ({ loading, onPress, children, style }: TProps) => {
  return (
    <button onClick={onPress} style={style}>
      {loading ? "Loading..." : children}
    </button>
  );
};
