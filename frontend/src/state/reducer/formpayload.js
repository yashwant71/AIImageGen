import { createSlice } from "@reduxjs/toolkit";

// const type payloadProp = {
//   formPayload : {
//     [key]:{
//       payload:{
//         [key]:{
//           isRequired:Boolean,
//           value:string | number,
//           type:string,
//           options:string[],
//           isAdvanceoption:Boolean,
//           hide:Boolean,
//           min:number,
//           max:number,
//           isFloat:boolean
//         }
//       }
//     }
//   }
// }

const initialState = {
  formPayload: {
    "prithivMLmods/IMAGINEO-4K": {
      type: "withKeys", // if withKeys then use prompt as it is
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
          // label:""
          // desc:""
        },
        negative_prompt: {
          value:
            "(deformed iris, deformed pupils), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
          type: "textarea",
        },
        use_negative_prompt: {
          value: true,
          type: "checkbox",
        },
        style: {
          value: "3840 x 2160",
          type: "radio",
          options: ["3840 x 2160", "2560 x 1440", "HD+", "Style Zero"],
        },
        collage_style: {
          value: "Hi-Res",
          type: "radio",
          options: [
            "Hi-Res",
            "B & W",
            "Polaroid",
            "Watercolor",
            "Cinematic",
            "Nostalgic",
            "Vintage",
            "Scrapbook",
            "NeoNGlow",
            "Geometric",
            "Thematic",
            "Cherry",
            "Fuchsia",
            "Pop",
            "Violet",
            "Sea Blue",
            "Sea Green",
            "Mustard",
            "Amber",
            "Pomelo",
            "Peppermint",
            "Mystic",
            "Pastel",
            "Coral",
            "No Style",
          ],
        }, //choices
        filter_name: {
          value: "Zero filter",
          type: "radio",
          options: [
            "Vivid",
            "Playa",
            "Desert",
            "West",
            "Blush",
            "Minimalist",
            "Zero filter",
          ],
        },
        grid_size: {
          value: "1x1",
          type: "dropdown",
          options: ["1x1", "2x1", "1x2", "2x2", "2x3", "3x2", "3x3"],
        },
        seed: { isAdvanceoption: true, value: 0, type: "number" },
        width: { isAdvanceoption: true, value: 512, type: "number" },
        height: { isAdvanceoption: true, value: 512, type: "number" },
        guidance_scale: { isAdvanceoption: true, value: 1, type: "number" },
        randomize_seed: {
          isAdvanceoption: true,
          value: true,
          type: "checkbox",
        },
      },
    },
    "mukaist/Midjourney": {
      type: "withKeys",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
          // label:""
          // desc:""
        },
        negative_prompt: {
          value:
            "(deformed iris, deformed pupils), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
          type: "textarea",
        },
        use_negative_prompt: {
          value: true,
          type: "checkbox",
        },
        style: {
          value: "3840 x 2160",
          type: "radio",
          options: ["3840 x 2160", "2560 x 1440", "HD+", "Style Zero"],
        },
        seed: { isAdvanceoption: true, value: 0, type: "number" },
        width: { isAdvanceoption: true, value: 512, type: "number" },
        height: { isAdvanceoption: true, value: 512, type: "number" },
        guidance_scale: { isAdvanceoption: true, value: 1, type: "number" },
        randomize_seed: {
          isAdvanceoption: true,
          value: true,
          type: "checkbox",
        },
      },
    },
    "mukaist/DALLE-4K": {
      type: "withKeys",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
          // label:""
          // desc:""
        },
        negative_prompt: {
          value:
            "(deformed iris, deformed pupils), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
          type: "textarea",
        },
        use_negative_prompt: {
          value: true,
          type: "checkbox",
        },
        style: {
          value: "3840 x 2160",
          type: "radio",
          options: ["3840 x 2160", "2560 x 1440", "HD+", "Style Zero"],
        },
        seed: { isAdvanceoption: true, value: 0, type: "number" },
        width: { isAdvanceoption: true, value: 512, type: "number" },
        height: { isAdvanceoption: true, value: 512, type: "number" },
        guidance_scale: { isAdvanceoption: true, value: 1, type: "number" },
        randomize_seed: {
          isAdvanceoption: true,
          value: true,
          type: "checkbox",
        },
      },
    },
    "Boboiazumi/animagine-xl-3.1": {
      type: "withKeys",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
          // label:""
          // desc:""
        },
        negative_prompt: {
          value: "",
          type: "textarea",
        },
        seed: {
          isAdvanceoption: true,
          value: Math.floor(Math.random() * (2147483647 + 1)),
          type: "number",
        },
        custom_width: {
          isAdvanceoption: true,
          value: 1024,
          type: "number",
          min: 512,
          max: 2048,
        },
        custom_height: {
          isAdvanceoption: true,
          value: 1024,
          type: "number",
          min: 512,
          max: 2048,
        },
        guidance_scale: {
          isAdvanceoption: true,
          value: 7,
          type: "slider",
          min: 1,
          max: 12,
        },
        num_inference_steps: {
          isAdvanceoption: true,
          value: 28,
          type: "slider",
          min: 1,
          max: 50,
        },
        sampler: {
          value: "Euler a",
          type: "dropdown",
          options: [
            "DPM++ 2M Karras",
            "DPM++ SDE Karras",
            "DPM++ 2M SDE Karras",
            "Euler",
            "Euler a",
            "DDIM",
          ],
        },
        aspect_ratio_selector: {
          value: "896 x 1152",
          options: [
            "1024 x 1024",
            "1152 x 896",
            "896 x 1152",
            "1216 x 832",
            "832 x 1216",
            "1344 x 768",
            "768 x 1344",
            "1536 x 640",
            "640 x 1536",
            "Custom",
          ],
          type: "radio",
        },
        style_selector: {
          value: "(None)",
          type: "radio",
          options: [
            "(None)",
            "Cinematic",
            "Photographic",
            "Anime",
            "Manga",
            "Digital Art",
            "Pixel art",
            "Fantasy art",
            "Neonpunk",
            "3D Model",
          ],
        },
        quality_selector: {
          type: "dropdown",
          value: "Standard v3.1",
          options: [
            "(None)",
            "Standard v3.0",
            "Standard v3.1",
            "Light v3.1",
            "Heavy v3.1",
          ],
        },
        use_upscaler: { type: "checkbox", value: false }, // boolean  in 'Use Upscaler' Checkbox component
        upscaler_strength: {
          type: "slider",
          value: 0.5,
          hide: true,
          min: 0,
          max: 1,
          step: 0.1,
          isFloat: true,
        }, // image strength
        upscale_by: {
          type: "slider",
          value: 1,
          min: 1,
          max: 1.5,
          step: 0.1,
          isFloat: true,
        },
        add_quality_tags: {
          type: "checkbox",
          value: true,
        },
        isImg2Img: {
          type: "checkbox",
          value: false,
          hide: true,
        },
        img_path: {
          type: "imageUpload",
          hide: true,
          value: null,
        },
        img2img_strength: {
          value: 0.5,
          type: "slider",
          min: 0,
          max: 1,
          hide: true,
        },
      },
    },
  },
};

const FormPayloadSlice = createSlice({
  name: "FormPayload",
  initialState,
  reducers: {
    setElements: (state, action) => {
      state.formPayload = action.payload;
    },
  },
});

export const { setElements } = FormPayloadSlice.actions;

// export const selectFormPayload = (state) => state.FormPayload;

export default FormPayloadSlice.reducer;
