use std::io::Cursor;

use image::{io::Reader, ImageFormat};
use js_sys::ArrayBuffer;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn convert(data: &ArrayBuffer) -> Result<ArrayBuffer, String> {
    let data = array_buffer_to_vec(data);
    let data = convert_image_data(data).ok_or("Failed to convert Image.")?;
    let data = vec_to_array_buffer(&data);
    Ok(data)
}

fn array_buffer_to_vec(data: &ArrayBuffer) -> Vec<u8> {
    let data = js_sys::Uint8Array::new(data);
    let mut result: Vec<u8> = vec![0; data.length() as usize];
    data.copy_to(&mut result);
    result
}

fn vec_to_array_buffer(data: &Vec<u8>) -> ArrayBuffer {
    let result = ArrayBuffer::new(data.len() as u32);
    let handle = js_sys::Uint8Array::new(&result);
    handle.copy_from(data);
    result
}

fn convert_image_data(data: Vec<u8>) -> Option<Vec<u8>> {
    let img = Reader::new(Cursor::new(data))
        .with_guessed_format()
        .ok()?
        .decode()
        .ok()?;
    let mut data = Vec::<u8>::new();
    let mut writer = Cursor::new(&mut data);
    img.write_to(&mut writer, ImageFormat::Png).ok()?;
    Some(data)
}
