import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formPayload: {
    prompt: "",
    negative_prompt:
      "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
    use_negative_prompt: true,
    style: "3840 x 2160",
    seed: 0,
    width: 512,
    height: 512,
    guidance_scale: 6,
    randomize_seed: true,
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
