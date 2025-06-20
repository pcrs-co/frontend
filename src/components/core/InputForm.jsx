export default function InputForm() {
  return (
    <>
      <form className="space-y-5">
        <label className="select w-full">
          <span className="label">What do you do primarily?</span>
          <select>
            <option value="" disabled>
              Select your primary purpose
            </option>
            <option>Gaming</option>
            <option>Office Work</option>
            <option>Creatives / Design</option>
            <option>Software Development</option>
            <option>Studying</option>
            <option>Casual Use</option>
          </select>
        </label>
        <div className="flex flex-col w-full">
          <input
            type="range"
            min={0}
            max="100"
            className="range range-sm w-full"
          />
          <div className="flex justify-between mt-2 text-xs">
            <span>Budget</span>
            <span>Balanced</span>
            <span>Performance</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <select className="select w-[58%]">
            <option value="" disabled>
              -- Level --
            </option>
            <option>Basic</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button className="btn btn-info w-[40%]">Submit</button>
        </div>
      </form>
    </>
  );
}
