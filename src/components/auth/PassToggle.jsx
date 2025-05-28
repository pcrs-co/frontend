import { EyeCloseIcon, EyeIcon } from "../../assets/icons";

export default function PassToggle({checked, onChange}) {
  return (
    <label className="swap">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <EyeIcon className="swap-on fill-gray-500 dark:fill-gray-400 size-full" />
      <EyeCloseIcon className="swap-off fill-gray-500 dark:fill-gray-400 size-full" />
    </label>
  );
}