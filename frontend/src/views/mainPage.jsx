import { useEffect, useState } from "react";
import { Client } from "@gradio/client";
import { useDispatch, useSelector } from "react-redux";
import { setElements } from "../state/reducer/formpayload";
import { ConvertToTitleCase, FormatPayload } from "../utils/usefulfunctions";
// import axios from "axios";
// import apiConfig from "../services/apiconfig";
/* eslint-disable react/prop-types */
const MainPage = () => {
  const submissionQueueLimit = 2;
  const [selectedApi, setselectedApi] = useState("prithivMLmods/IMAGINEO-4K");
  // eslint-disable-next-line no-unused-vars
  const [apis, setApis] = useState([
    "prithivMLmods/IMAGINEO-4K",
    "mukaist/Midjourney",
    "mukaist/DALLE-4K",
    "Boboiazumi/animagine-xl-3.1",
    // "cagliostrolab/animagine-xl-3.1",// uses string[] in payload
    // "gokaygokay/PonyRealism" // need different payloads
    // "prithivMLmods/EPIC-REALISM" // need string[] in payload check from network
    // "prithivMLmods/Text-To-Image" // need string[] in payload check from network
    // "PIXAR-4K" // need string[] in payload check from network
    // "prithivMLmods/STABLE-HAMSTER" // need string[] in payload check from network
    // "multimodalart/stable-cascade" // need string[] in payload check from network
  ]);
  const [loading, setLoading] = useState(false);
  const [ShowAdvanceOptions, setShowAdvanceOptions] = useState(false);
  const [result, setResult] = useState([]);
  const { formPayload } = useSelector((state) => state.formpayload);
  // console.log(formPayload); //  {...}

  const [submissionQueue, setSubmissionQueue] = useState([]);
  const processSubmission = async (formPayloadData) => {
    setLoading(true);
    try {
      console.log("payloadtoapi", formPayloadData);
      const client = await Client.connect(selectedApi);
      const response = await client.predict("/run", { ...formPayloadData });
      if (response.data[0][0].image.url) {
        setResult((prevResult) => [
          response.data[0][0].image.url,
          ...prevResult,
        ]);
      }
      // const response = await apiConfig.post("/run", formPayload);
      console.log(response);
    } catch (error) {
      alert(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submissionQueue.length >= submissionQueueLimit) {
      alert("Daddy chiill ! take a breather.");
      return;
    }
    // Format the payload before adding to the submission queue
    const formattedPayload = FormatPayload(
      formPayload[selectedApi].payload,
      formPayload[selectedApi].type
    );
    setSubmissionQueue((prevQueue) => [...prevQueue, formattedPayload]);

    // If not already processing, start processing the queue
    if (!loading && submissionQueue.length > 0) {
      const currentPayload = submissionQueue[0];
      setSubmissionQueue((prevQueue) => prevQueue.slice(1));
      await processSubmission(currentPayload);
    }
  };

  // Process submissions in the queue when loading is complete
  useEffect(() => {
    if (!loading && submissionQueue.length > 0) {
      const currentPayload = submissionQueue[0];
      setSubmissionQueue((prevQueue) => prevQueue.slice(1));
      processSubmission(currentPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, submissionQueue]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-x-hidden">
      <div className="mt-4 md:flex">
        <form onSubmit={handleSubmit} className="w-[300px] p-4">
          <button type="submit" className="w-full mb-3">
            Generate Image
          </button>
          <div className="mb-2 w-full">
            <div className=" text-[12px]">API</div>
            <select
              className="w-full"
              id="api"
              value={selectedApi}
              onChange={(e) => setselectedApi(e.target.value)}
            >
              <option disabled>Select api</option>
              {apis.map((api) => (
                <option key={api} value={api}>
                  {api}
                </option>
              ))}
            </select>
          </div>

          <Custominputs selectedApi={selectedApi} />
          <div
            className="cursor-pointer mb-2 underline"
            onClick={() => setShowAdvanceOptions(!ShowAdvanceOptions)}
          >
            {ShowAdvanceOptions
              ? "hide advanced options"
              : "show advanced options"}
          </div>
          {ShowAdvanceOptions ? (
            <>
              {" "}
              <Custominputs selectedApi={selectedApi} showAdvancedOpt={true} />
            </>
          ) : (
            ""
          )}
          {/* <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Image"}
          </button> */}
        </form>
        <ShowImage
          result={result}
          loading={loading}
          submissionQueue={submissionQueue}
        />
      </div>
    </div>
  );
};

function Custominputs({ selectedApi, showAdvancedOpt = false }) {
  const { formPayload } = useSelector((state) => state.formpayload);
  // console.log(elements); // {formPayload: {...}}
  const dispatch = useDispatch();

  const handleFormPayloadChange = (e) => {
    const { name, value, type, checked } = e.target;
    var tempval = value;
    if (type === "number" || type === "slider") {
      tempval = parseInt(value);
    } else if (type === "checkbox") {
      tempval = checked;
    }
    // updating selected api's payload prop
    dispatch(
      setElements({
        ...formPayload,
        [selectedApi]: {
          ...formPayload[selectedApi],
          payload: {
            ...formPayload[selectedApi].payload,
            [name]: {
              ...formPayload[selectedApi].payload[name],
              value: tempval,
            },
          },
        },
      })
    );
  };

  return (
    <>
      {Object.entries(formPayload[selectedApi]?.payload).map(([key, value]) => {
        // if showAdvancedOpt false , then show non advanced ones
        if (
          (showAdvancedOpt ? value.isAdvanceoption : !value.isAdvanceoption) &&
          !value.hide
        ) {
          return (
            <div key={key}>
              <div className="mb-3 w-full">
                <div className="text-gray-400 text-[12px]">
                  {ConvertToTitleCase(key)}
                </div>
                {value.type === "text" || value.type === "number" ? (
                  <input
                    className="w-full"
                    type={value.type}
                    name={key}
                    value={value.value}
                    onChange={handleFormPayloadChange}
                    placeholder={ConvertToTitleCase(key)}
                    required={value.isRequired}
                  />
                ) : value.type === "textarea" ? (
                  <textarea
                    className="w-full"
                    type={value.type}
                    name={name}
                    value={value.value}
                    onChange={handleFormPayloadChange}
                    placeholder={ConvertToTitleCase(key)}
                    required={value.isRequired}
                  />
                ) : value.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={value.value}
                    onChange={handleFormPayloadChange}
                  />
                ) : value.type === "dropdown" ? (
                  <select
                    className="w-full"
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
                  <div className="w-full">
                    {value.options.map((option, index) => (
                      <label key={index} className="pr-2 py-1">
                        <input
                          type="radio"
                          name={key}
                          value={option}
                          checked={value.value === option}
                          onChange={handleFormPayloadChange}
                        />
                        {option}
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
                    <span className="ml-2">
                      {parseFloat(value.value).toFixed(2)}
                    </span>
                  </div>
                ) : value.type === "number" ? (
                  <input
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
      })}
    </>
  );
}

function ShowImage({ result, loading, submissionQueue }) {
  const width = 300;
  return (
    <>
      <div className="flex flex-wrap">
        {loading && (
          <EmptyImageBox
            text={"generating (" + (submissionQueue.length + 1) + ")..."}
            width={width}
          />
        )}
        {result?.length ? (
          <>
            {result.map((imageUrl) => (
              <div key={imageUrl} className="m-1">
                <img src={imageUrl} alt="Not found" width={width} />
              </div>
            ))}
          </>
        ) : (
          <>
            {!loading && (
              <EmptyImageBox text="No image generated" width={width} />
            )}
          </>
        )}
      </div>
    </>
  );
}

function EmptyImageBox({ text, width }) {
  return (
    <div
      className={`w-[${width}px] border border-solid border-gray-400 flex items-center justify-center m-1`}
      style={{ height: width + "px" }}
    >
      {text}
    </div>
  );
}

export default MainPage;
