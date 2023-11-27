from PIL import Image

# Adding a coloured pixel is a workaround to add extra color channels to grayscale images without ruining the image color.
def draw_red_pixel_on_frames(gif_path, output_path):
    # Open the GIF file
    gif = Image.open(gif_path)

    # Create a list to store modified frames
    modified_frames = []

    # Iterate through each frame
    for frame in range(0, gif.n_frames):
        # Select the current frame
        gif.seek(frame)

        # Convert the frame to RGBA mode to allow transparency
        current_frame = gif.convert("RGBA")

        # Create a red pixel (RGBA format)
        red_pixel = (255, 0, 0, 255)  # (R, G, B, Alpha)

        # Draw a red pixel at coordinates (x=0, y=0) on the current frame
        current_frame.putpixel((0, 0), red_pixel)

        # Append modified frame to the list
        modified_frames.append(current_frame)

    # Save the modified frames as a new GIF
    modified_frames[0].save(output_path,
                            save_all=True,
                            append_images=modified_frames[1:],
                            loop=0)

# Provide the path to your GIF file and the desired output path for the modified GIF
input_gif_path = "./test.gif"
output_gif_path = "./test_output.gif"

# Call the function
draw_red_pixel_on_frames(input_gif_path, output_gif_path)