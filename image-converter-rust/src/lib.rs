use std::io::Cursor;

use image::{io::Reader, DynamicImage, ImageFormat, ImageOutputFormat};
use js_sys::ArrayBuffer;
use wasm_bindgen::prelude::wasm_bindgen;

// Attempt to use a smaller allocator
extern crate wee_alloc;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub enum Format {
    Png,
    Jpeg,
    Bmp,
    Gif,
}

impl From<&Format> for ImageFormat {
    fn from(format: &Format) -> Self {
        match format {
            Format::Png => ImageFormat::Png,
            Format::Jpeg => ImageFormat::Jpeg,
            Format::Bmp => ImageFormat::Bmp,
            Format::Gif => ImageFormat::Gif,
        }
    }
}

impl From<&Format> for ImageOutputFormat {
    fn from(format: &Format) -> Self {
        Into::<ImageFormat>::into(format).into()
    }
}

#[wasm_bindgen]
pub fn convert(data: &ArrayBuffer, from: Option<Format>, to: Format) -> Option<ArrayBuffer> {
    let data = array_buffer_to_vec(data);
    let data = convert_image_data(data, from, to)?;
    let data = vec_to_array_buffer(&data);
    Some(data)
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

fn convert_image_data(data: Vec<u8>, from: Option<Format>, to: Format) -> Option<Vec<u8>> {
    let img = decode_image(data, from)?;
    let mut data = Vec::<u8>::new();
    let mut writer = Cursor::new(&mut data);
    img.write_to(&mut writer, &to).ok()?;
    Some(data)
}

fn decode_image(data: Vec<u8>, from: Option<Format>) -> Option<DynamicImage> {
    let mut img = Reader::new(Cursor::new(data));
    let img = if let Some(from) = from {
        let format = (&from).into();
        img.set_format(format);
        img
    } else {
        img.with_guessed_format().ok()?
    };
    img.decode().ok()
}
