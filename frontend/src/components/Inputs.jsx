import { useEffect, useRef } from "react";
import { ConvertToTitleCase } from "../utils/usefulfunctions";

/* eslint-disable react/prop-types */
export function EachInputs({ payloadkey, value, handleFormPayloadChange }) {
  const key = payloadkey;
  const textareaRef = useRef(null);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef?.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);
  return (
    <div>
      <div className="mb-3 w-full">
        {value.type !== "checkbox" && (
          <div className="text-gray-400 text-[12px]">
            {ConvertToTitleCase(key)}
          </div>
        )}
        {value.type === "text" || value.type === "textarea" ? (
          <textarea
            ref={textareaRef}
            className="w-full px-2 py-1"
            type={value.type}
            rows={value.rows || (value.type === "text" ? 1 : 2)}
            name={key}
            value={value.value}
            onChange={(e) => {
              handleFormPayloadChange(e);
              adjustTextareaHeight();
            }}
            placeholder={ConvertToTitleCase(key)}
            required={value.isRequired}
          />
        ) : value.type === "checkbox" ? (
          <label className="flex items-center cursor-pointer">
            <input
              className="mr-2"
              type="checkbox"
              name={key}
              checked={value.value}
              onChange={handleFormPayloadChange}
            />
            <div className="text-gray-400 text-[12px]">
              {ConvertToTitleCase(key)}
            </div>
          </label>
        ) : value.type === "dropdown" ? (
          <select
            className="w-full px-2 py-1"
            name={key}
            value={value.value}
            onChange={handleFormPayloadChange}
          >
            {value?.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : value.type === "radio" ? (
          <div className="w-full flex flex-wrap">
            {value.options.map((option, index) => (
              <label
                key={index}
                className="mr-2 my-0.5 px-1 bg-[#0f0f0f] rounded border border-solid border-gray-700 cursor-pointer flex items-center w-fit"
              >
                <input
                  type="radio"
                  name={key}
                  value={option}
                  checked={value.value === option}
                  onChange={handleFormPayloadChange}
                />
                <span className="ml-0.5">{option}</span>
              </label>
            ))}
          </div>
        ) : value.type === "slider" ? (
          <div className="flex items-center justify-between w-full">
            <input
              className="w-full"
              type="range"
              name={key}
              value={value.value}
              onChange={handleFormPayloadChange}
              min={value.min}
              max={value.max}
              step={value.step || 1}
              required={value.isRequired}
            />
            <span className="ml-2">{parseFloat(value.value).toFixed(2)}</span>
          </div>
        ) : value.type === "number" ? (
          <input
            className="w-full px-2 py-1"
            type="number"
            name={key}
            value={value.value}
            onChange={handleFormPayloadChange}
            min={value.min}
            max={value.max}
            required={value.isRequired}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
