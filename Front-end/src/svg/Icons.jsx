import icons from "./icons.svg";

function Icons({ letter, size = "30px", color = "black" }) {
  return (
    <svg className={`svg-${letter}`} fill={color} width={size} height={size}>
      <use href={`${icons}#icon-${letter}`} />
    </svg>
  );
}

export default Icons;
