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
//           isRandomizefn:fn
//         }
//       }
//     }
//   }
// }
const initialState = {
  formPayload: {
    "prithivMLmods/IMAGINEO-4K": {
      payloadType: "string", // if withKeys then use prompt as it is
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
      payloadType: "string",
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
      payloadType: "string",
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
      payloadType: "string",
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
          isRandomize: true,
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
    "prodia/sdxl-stable-diffusion-xl": {
      payloadType: "string",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
        },
        negative_prompt: {
          value: "(deformed eyes, nose, ears, nose), bad anatomy, ugly",
          type: "textarea",
        },
        stable_diffusion_checkpoints: {
          value: "sd_xl_base_1.0.safetensors [be9edd61]",
          type: "dropdown",
          options: [
            "animagineXLV3_v30.safetensors [75f2f05b]",
            "devlishphotorealism_sdxl15.safetensors [77cba69f]",
            "dreamshaperXL10_alpha2.safetensors [c8afe2ef]",
            "dynavisionXL_0411.safetensors [c39cc051]",
            "juggernautXL_v45.safetensors [e75f5471]",
            "realismEngineSDXL_v10.safetensors [af771c3f]",
            "realvisxlV40.safetensors [f7fdcb51]",
            "sd_xl_base_1.0.safetensors [be9edd61]",
            "sd_xl_base_1.0_inpainting_0.1.safetensors [5679a81a]",
            "turbovisionXL_v431.safetensors [78890989]",
          ],
        },
        sampling_step: {
          value: 20,
          type: "slider",
          isAdvanceoption: true,
          min: 1,
          max: 25,
        },
        sampler: {
          value: "DPM++ 2M Karras",
          type: "dropdown",
          options: [
            "DPM++ 2M Karras",
            "DPM++ SDE Karras",
            "DPM++ 2M SDE Exponential",
            "DPM++ 2M SDE Karras",
            "Euler a",
            "Euler",
            "LMS",
            "Heun",
            "DPM2",
            "DPM2 a",
            "DPM++ 2S a",
            "DPM++ 2M",
            "DPM++ SDE",
            "DPM++ 2M SDE",
            "DPM++ 2M SDE Heun",
            "DPM++ 2M SDE Heun Karras",
            "DPM++ 2M SDE Heun Exponential",
            "DPM++ 3M SDE",
            "DPM++ 3M SDE Karras",
            "DPM++ 3M SDE Exponential",
            "DPM fast",
            "DPM adaptive",
            "LMS Karras",
            "DPM2 Karras",
            "DPM2 a Karras",
            "DPM++ 2S a Karras",
            "Restart",
            "DDIM",
            "PLMS",
          ],
        },
        cfg_scale: {
          value: 7,
          type: "slider",
          isAdvanceoption: true,
          min: 1,
          max: 20,
        },
        width: {
          value: 1024,
          type: "slider",
          min: 512,
          max: 1536,
        },
        height: {
          value: 1024,
          type: "slider",
          min: 512,
          max: 1536,
        },
        seed: {
          type: "number",
          isAdvanceoption: true,
          value: -1,
        },
      },
    },
    "KingNish/SDXL-Flash": {
      payloadType: "string",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
        },
        negative_prompt: {
          value: "",
          type: "textarea",
        },
        use_negative_prompt: {
          value: true,
          type: "checkbox",
        },
        seed: {
          isAdvanceoption: true,
          value: 0,
          type: "number",
          isRandomize: true,
          hide: true,
        },
        width: {
          value: 1024,
          type: "slider",
          min: 512,
          max: 4096,
        },
        height: {
          value: 1024,
          type: "slider",
          min: 512,
          max: 4096,
        },
        guidance_scale: {
          isAdvanceoption: true,
          value: 3,
          type: "slider",
          step: 0.1,
          min: 0.1,
          max: 6,
        },
        num_inference_steps: {
          isAdvanceoption: true,
          value: 8,
          type: "slider",
          min: 1,
          max: 15,
        },
        randomize_seed: {
          isAdvanceoption: true,
          value: true,
          type: "checkbox",
        },
      },
    },
    "Akimitsujiro/Stable-Diffusion-XL": {
      payloadType: "string",
      payload: {
        prompt: {
          isRequired: true,
          value: "",
          type: "text",
        },
        negative_prompt: {
          value: "",
          type: "textarea",
        },
        seed: {
          isAdvanceoption: true,
          value: 0,
          type: "number",
          isRandomize: true,
          hide: true,
        },
        width: {
          value: 512,
          type: "slider",
          min: 512,
          max: 4096,
        },
        height: {
          value: 512,
          type: "slider",
          min: 512,
          max: 4096,
        },
        guidance_scale: {
          isAdvanceoption: true,
          value: 7,
          type: "slider",
          step: 0.1,
          min: 0.1,
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
            "DPM++ 2S a",
            "Heun",
            "DPM fast",
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
        collage_style: {
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
            "Analog Film",
            "Comics Book",
            "Line Art",
            "Illustration | Anime",
            "Illustration | Chibi",
            "Design | Avatar",
            "Glitch",
            "Pencil",
            "Texture",
            "Advertising",
            "Food Photography",
            "Real Estate",
            "Abstract",
            "Cubist",
            "Graffiti",
            "Hyperrealism",
            "Impressionist",
            "Pointillism",
            "Pop Art",
            "Psychedelic",
            "Renaissance",
            "Steampunk",
            "Surrealist",
            "Typography",
            "Watercolor",
            "Fighting Game",
            "GTA",
            "Super Mario",
            "Minecraft",
            "Pokémon",
            "Retro Arcade",
            "Retro Game",
            "RPG Fantasy Game",
            "Strategy Game",
            "Street Fighter",
            "Legend of Zelda",
            "Architectural",
            "Disco",
            "Dreamscape",
            "Dystopian",
            "Fairy Tale",
            "Gothic",
            "Grunge",
            "Horror",
            "Minimalist",
            "Monochrome",
            "Nautical",
            "Space",
            "Stained Glass",
            "Techwear Fashion",
            "Tribal",
            "Zentangle",
            "Collage",
            "Flat Papercut",
            "Kirigami",
            "Paper Mache",
            "Paper Quilling",
            "Papercut Collage",
            "Papercut Shadow Box",
            "Stacked Papercut",
            "Thick Layered Papercut",
            "Alien",
            "Film Noir",
            "HDR",
            "Long Exposure",
            "Neon Noir",
            "Silhouette",
            "Tilt-Shift",
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
            "NSFW",
          ],
        },
        use_upscaler: { type: "checkbox", value: false }, // boolean  in 'Use Upscaler' Checkbox component
        upscaler_strength: {
          type: "slider",
          value: 0.5,
          // hide: true,
          min: 0,
          max: 1,
          step: 0.5,
          isFloat: true,
        },
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
