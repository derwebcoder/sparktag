export interface IconProps {
  url: string;
  className?: string;
}

export const Icon = (props: IconProps) => {
  return <img src={props.url} alt="" className={props.className} />;
};
