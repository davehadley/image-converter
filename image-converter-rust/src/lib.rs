use std::io::Cursor;

use image::{imageops::FilterType, io::Reader, DynamicImage, ImageFormat, ImageOutputFormat};
use js_sys::ArrayBuffer;
use wasm_bindgen::prelude::wasm_bindgen;

// Attempt to use a smaller allocator
extern crate wee_alloc;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Format {
    Png,
    Jpeg,
    Bmp,
    Gif,
    // uses the libwebp C library to encode
    // we should be able to read, but we cannot write
    // WebP,
    Pnm,
    Tiff,
    Tga,
    // can decode but cannot encode so we cannot write
    // Dds,
    Ico,
    // can read but cannot write
    // Hdr,
    // exr crashes in wasm with "unreachable executed"
    // OpenExr,
    Farbfeld,
    // uses C library to decode and encode
    // we cannot read, but we should be able to write
    // Avif,
}

impl From<&Format> for ImageFormat {
    fn from(format: &Format) -> Self {
        match format {
            Format::Png => ImageFormat::Png,
            Format::Jpeg => ImageFormat::Jpeg,
            Format::Bmp => ImageFormat::Bmp,
            Format::Gif => ImageFormat::Gif,
            // Format::WebP => ImageFormat::WebP,
            Format::Pnm => ImageFormat::Pnm,
            Format::Tiff => ImageFormat::Tiff,
            Format::Tga => ImageFormat::Tga,
            // Format::Dds => ImageFormat::Dds,
            Format::Ico => ImageFormat::Ico,
            // Format::Hdr => ImageFormat::Hdr,
            // Format::OpenExr => ImageFormat::OpenExr,
            Format::Farbfeld => ImageFormat::Farbfeld,
            // Format::Avif => ImageFormat::Avif,
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
    let img = match to {
        Format::Ico => sanitize_ico(img),
        // Format::OpenExr => sanitize_openexr(img),
        Format::Farbfeld => sanitize_farbfeld(img),
        _ => img,
    };
    let mut data = Vec::<u8>::new();
    let mut writer = Cursor::new(&mut data);
    let result = img.write_to(&mut writer, &to);
    if let Err(err) = result {
        println!("{err:?}");
    }
    Some(data)
}

fn sanitize_ico(img: DynamicImage) -> DynamicImage {
    // Ico file cannot be larger than 256x256
    if img.width() > 256 || img.height() > 256 {
        img.resize(256, 256, FilterType::Lanczos3)
    } else {
        img
    }
}

// fn sanitize_openexr(img: DynamicImage) -> DynamicImage {
//     // can only output RGB32F or RGBA32F
//     match img {
//         DynamicImage::ImageLuma8(_)
//         | DynamicImage::ImageRgb8(_)
//         | DynamicImage::ImageLuma16(_)
//         | DynamicImage::ImageRgb16(_)
//         | DynamicImage::ImageRgb32F(_) => img.into_rgb32f().into(),
//         DynamicImage::ImageLumaA8(_)
//         | DynamicImage::ImageRgba8(_)
//         | DynamicImage::ImageLumaA16(_)
//         | DynamicImage::ImageRgba16(_)
//         | DynamicImage::ImageRgba32F(_) => img.into_rgba32f().into(),
//         _ => img.into_rgba32f().into(),
//     }
// }

fn sanitize_farbfeld(img: DynamicImage) -> DynamicImage {
    // can only output Rgba16
    img.into_rgba16().into()
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

#[cfg(test)]
mod tests {

    use rstest::rstest;
    use wasm_bindgen_test::wasm_bindgen_test;

    use super::*;

    pub const TEST_IMAGE: &[u8] = include_bytes!("../../image-converter-react/test/test_image.gif");

    #[rstest]
    #[case(Format::Png)]
    #[case(Format::Jpeg)]
    #[case(Format::Bmp)]
    #[case(Format::Gif)]
    // #[case(Format::WebP)]
    #[case(Format::Pnm)]
    #[case(Format::Tiff)]
    #[case(Format::Tga)]
    // #[case(Format::Dds)]
    #[case(Format::Ico)]
    // #[case(Format::Hdr)]
    // #[case(Format::OpenExr)]
    #[case(Format::Farbfeld)]
    // #[case(Format::Avif)]
    #[wasm_bindgen_test]
    fn test_convert(#[case] to: Format) {
        let actual: Option<Vec<u8>>;
        let data = TEST_IMAGE;
        #[cfg(target_arch = "wasm32")]
        {
            let data = vec_to_array_buffer(&data.to_vec());
            let buffer = convert(&data, None, to.clone());
            actual = buffer.map(|it| array_buffer_to_vec(&it));
        }
        #[cfg(not(target_arch = "wasm32"))]
        {
            actual = convert_image_data(data.to_vec(), None, to);
        }
        assert!(actual.is_some());
        assert!(!actual.unwrap().is_empty());
    }
}
