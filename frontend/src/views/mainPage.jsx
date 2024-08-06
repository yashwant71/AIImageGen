import { Fragment, useEffect, useState } from "react";
// import { Client } from "@gradio/client";
import { useDispatch, useSelector } from "react-redux";
import { setElements } from "../state/reducer/formpayload";
import {
  convertApiNameForUrlFormat,
  FormatPayload,
} from "../utils/usefulfunctions";
// import axios from "axios";
import apiConfig from "../services/apiconfig";
import { fnIndexAndTriggerIdMapper } from "../data";
import { EachInputs } from "../components/Inputs";
import { saveAs } from "file-saver";

/* eslint-disable react/prop-types */
const localStoragName = "Aigradimages";
const MainPage = () => {
  const submissionQueueLimit = 3;
  const [selectedApi, setselectedApi] = useState("mukaist/Midjourney");
  // eslint-disable-next-line no-unused-vars
  const [apis, setApis] = useState([
    "mukaist/Midjourney",
    "prithivMLmods/IMAGINEO-4K",
    "mukaist/DALLE-4K",
    "Boboiazumi/animagine-xl-3.1",
    "KingNish/SDXL-Flash",
    "prodia/sdxl-stable-diffusion-xl",
    "Akimitsujiro/Stable-Diffusion-XL",
    "prithivMLmods/EPIC-REALISM",
    "John6666/votepurchase-multiple-model", // great multimodel

    // "cagliostrolab/animagine-xl-3.1",
    // "gokaygokay/PonyRealism"
    // "prithivMLmods/Text-To-Image"
    // "PIXAR-4K"
    // "prithivMLmods/STABLE-HAMSTER"
    // "multimodalart/stable-cascade"
  ]);

  const [loading, setLoading] = useState(false);
  const [imageWidth, setimageWidth] = useState(150);
  const [ShowAdvanceOptions, setShowAdvanceOptions] = useState(false);
  const [result, setResult] = useState(() => {
    const images = JSON.parse(localStorage.getItem(localStoragName)) || [];
    return images;
  });
  const { formPayload } = useSelector((state) => state.formpayload);
  const [submissionQueue, setSubmissionQueue] = useState([]);

  const processSubmission = async (formPayloadData) => {
    setLoading(true);
    try {
      // console.log("payloadtoapi", formPayloadData);
      // const client = await Client.connect(selectedApi);
      // const response = await client.predict("/run", { ...formPayloadData });
      // if (response.data[0][0].image.url) {
      //   setResult((prevResult) => [
      //     response.data[0][0].image.url,

      //     ...prevResult,
      //   ]);
      // }
      const { data } = await apiConfig.post("/gradio", {
        payload: formPayloadData,
        selectedApi: convertApiNameForUrlFormat(selectedApi),
        trigger_id: fnIndexAndTriggerIdMapper[selectedApi].trigger_id,
        fn_index: fnIndexAndTriggerIdMapper[selectedApi].fn_index,
      });
      if (data) {
        // save in local storage
        const imageObj = {
          selectedApi: selectedApi,
          url: data,
          prompt: formPayloadData[0],
          negative_prompt: formPayloadData[1],
        };
        const images = JSON.parse(localStorage.getItem(localStoragName)) || [];
        images.unshift(imageObj); // at first position
        localStorage.setItem(localStoragName, JSON.stringify(images));
        // save in state
        setResult((prevResult) => [imageObj, ...prevResult]);
      } else {
        alert("some error occured, Try with different Api!!");
      }
    } catch (error) {
      let errmessage = "unexpected issue occured, try again later";
      if (error?.response?.data?.message) {
        errmessage = error.response.data.message;
      }
      alert(errmessage);
      console.error(errmessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submissionQueue.length >= submissionQueueLimit) {
      alert("Slow down!! take a breather.");
      return;
    }
    // Format the payload before adding to the submission queue
    const formattedPayload = FormatPayload(
      formPayload[selectedApi].payload,
      formPayload[selectedApi].payloadType
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
    <div className="w-[100vw] h-[100vh] overflow-x-hidden md:overflow-y-hidden text-[12px]">
      <div className=" min-h-screen">
        <div className="flex w-full items-center justify-center text-[10px] text-gray-400">
          Images are stored locally on your browser. We do not store any images
          on our servers.
        </div>
        {/* main page container */}
        <div className="flex flex-col md:flex-row">
          {/* left side */}
          <form
            onSubmit={handleSubmit}
            className=" p-4 py-0 my-1 md:pb-10 md:w-[25%] md:h-screen md:overflow-y-auto"
          >
            <button type="submit" className="w-full mb-3 text-black bg-white">
              <span>
                {loading
                  ? "Generating Image (" + (submissionQueue.length + 1) + ")..."
                  : "Generate Image"}
              </span>
            </button>
            <div className="pb-3 w-full border-0 border-b border-solid border-gray-600 mb-1">
              <div className=" text-[12px]">API</div>
              <select
                className="w-full px-2 py-1"
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
                <Custominputs
                  selectedApi={selectedApi}
                  showAdvancedOpt={true}
                />
              </>
            ) : (
              ""
            )}
            {/* <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Image"}
            </button> */}
          </form>
          {/* right side  */}
          <div className="md:w-[80%] ">
            {/* header div */}
            <div className="flex items-center justify-end w-full mx-0 md:mx-2 border-0 border-t border-solid border-gray-500 md:border-0 py-2 md:py-0">
              <div>tile size</div>
              <input
                className="md:w-[100px]  mx-2"
                type="range"
                name={"imgWidth"}
                value={imageWidth / 50}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setimageWidth(value * 50);
                }}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div className="w-full md:h-screen md:overflow-y-auto">
              <ShowImage
                imageWidth={imageWidth}
                result={result}
                setResult={setResult}
              />
            </div>
          </div>
        </div>
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
      {Object.entries(formPayload[selectedApi]?.payload).map(([key, value]) => (
        // if showAdvancedOpt false , then show non advanced ones
        // if (
        // (showAdvancedOpt ? value.isAdvanceoption : !value.isAdvanceoption) &&
        // !value.hide
        // ) {
        <Fragment key={key}>
          <>
            {(showAdvancedOpt
              ? value.isAdvanceoption
              : !value.isAdvanceoption) && !value.hide ? (
              <EachInputs
                // key={key}
                payloadkey={key}
                value={value}
                handleFormPayloadChange={handleFormPayloadChange}
              />
            ) : (
              ""
            )}
          </>
        </Fragment>
        // }
      ))}
    </>
  );
}

function ShowImage({ imageWidth, result, setResult }) {
  // const width = 300;
  const handleDeleteImage = (image) => {
    const images = JSON.parse(localStorage.getItem(localStoragName)) || [];
    const index = images.findIndex((obj) => obj.url === image);
    if (index !== -1) {
      images.splice(index, 1);
      localStorage.setItem(localStoragName, JSON.stringify(images));
      setResult(images);
    }
  };

  function showImageInfo(image) {
    const { prompt, negative_prompt, selectedApi } = image;
    const message = `API: ${selectedApi}\nPrompt: ${prompt}\nNegative Prompt: ${negative_prompt}`;
    alert(message);
  }
  const handleDownloadImage = (image) => {
    const url = new URL(image.url);
    const fileName = url.pathname.split("/").pop();
    saveAs(image.url, fileName);
  };
  return (
    <>
      <div className="flex flex-wrap items-start justify-start">
        {result?.length ? (
          <>
            {result.map((image) => (
              <div key={image.url} className="m-1 relative group h-fit">
                <img
                  src={image.url}
                  alt="Not found"
                  width={imageWidth}
                  className="rounded"
                />
                <div className="absolute top-0 right-0 m-1 transition duration-300 ease-in-out  opacity-0 group-hover:opacity-100 ">
                  <button
                    onClick={() => handleDeleteImage(image.url)}
                    className="rounded flex items-center justify-center w-6 h-6 p-0 m-0 bg-[#1f1f1f] mb-2"
                  >
                    x
                  </button>
                  <button
                    onClick={() => showImageInfo(image)}
                    className="rounded flex items-center justify-center w-6 h-6 p-0 m-0 bg-[#1f1f1f] mb-2"
                  >
                    i
                  </button>
                  <button
                    onClick={() => handleDownloadImage(image)}
                    className="rounded flex items-center justify-center w-6 h-6 p-0 m-0 bg-[#1f1f1f] mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <EmptyImageBox text="No image generated" width={imageWidth} />
        )}
      </div>
    </>
  );
}

function EmptyImageBox({ text, width }) {
  return (
    <div
      className={`w-[${width}px] border border-solid border-gray-700 items-center justify-center m-1 h-inherit w-full flex py-2`}
      // style={{ height: width + "px" }}
    >
      {text}
    </div>
  );
}

export default MainPage;
