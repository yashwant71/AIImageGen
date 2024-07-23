import { useEffect, useState } from "react";
import { Client } from "@gradio/client";
import { useDispatch, useSelector } from "react-redux";
import { setElements } from "../state/reducer/formpayload";
import { ConvertToTitleCase } from "../utils/convertToTitleCase";
/* eslint-disable react/prop-types */
const MainPage = () => {
  const submissionQueueLimit = 2;
  const [api, setApi] = useState("prithivMLmods/IMAGINEO-4K");
  // eslint-disable-next-line no-unused-vars
  const [apis, setApis] = useState([
    "prithivMLmods/IMAGINEO-4K",
    "mukaist/Midjourney",
    "mukaist/DALLE-4K",
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
  const elements = useSelector((state) => state.formpayload);
  // console.log(elements); // {formPayload: {...}}

  const [submissionQueue, setSubmissionQueue] = useState([]);
  const processSubmission = async (formPayload) => {
    setLoading(true);
    try {
      const client = await Client.connect(api);
      const response = await client.predict("/run", { ...formPayload });
      if (response.data[0][0].image.url) {
        setResult((prevResult) => [
          response.data[0][0].image.url,
          ...prevResult,
        ]);
      }
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
      alert("Daddy chill ! take a breather.");
      return;
    }

    setSubmissionQueue((prevQueue) => [...prevQueue, elements.formPayload]);

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
          <div className="mb-2">
            <div className=" text-[12px]">API</div>
            <select
              id="api"
              value={api}
              onChange={(e) => setApi(e.target.value)}
            >
              <option disabled>Select api</option>
              {apis.map((api) => (
                <option key={api} value={api}>
                  {api}
                </option>
              ))}
            </select>
          </div>

          <Custominputs
            type="text"
            name="prompt"
            isTextArea={true}
            isRequired={true}
          />
          <Custominputs
            type="text"
            name="negative_prompt"
            isTextArea={true}
            isRequired={false}
          />
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
              <Custominputs
                type="number"
                name="width"
                isTextArea={false}
                isRequired={false}
              />
              <Custominputs
                type="number"
                name="height"
                isTextArea={false}
                isRequired={false}
              />
              <Custominputs
                type="number"
                name="guidance_scale"
                isTextArea={false}
                isRequired={false}
              />
            </>
          ) : (
            ""
          )}
          {/* <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Image"}
          </button> */}
          <button type="submit">Generate Image</button>
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

function Custominputs({ type, name, isTextArea, isRequired }) {
  const elements = useSelector((state) => state.formpayload);
  // console.log(elements); // {formPayload: {...}}
  const dispatch = useDispatch();

  const handleFormPayloadChange = (e) => {
    const { name, value, type } = e.target;
    var tempval = value;
    if (type === "number") {
      tempval = parseInt(value);
    }
    dispatch(setElements({ ...elements.formPayload, [name]: tempval }));
  };

  return (
    <div className="mb-2">
      <div className=" text-[12px]">{ConvertToTitleCase(name)}</div>
      {!isTextArea ? (
        <input
          className="w-[250px]"
          type={type}
          name={name}
          value={elements.formPayload[name]}
          onChange={handleFormPayloadChange}
          placeholder={ConvertToTitleCase(name)}
          required={isRequired}
        />
      ) : (
        <textarea
          className="w-[250px]"
          type={type}
          name={name}
          value={elements.formPayload[name]}
          onChange={handleFormPayloadChange}
          placeholder={ConvertToTitleCase(name)}
          required={isRequired}
        />
      )}
    </div>
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
