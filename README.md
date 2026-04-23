# Getting started

To get started with the app:

1.  **Install Dependencies**  
     Run the following command to install the required dependencies:

        ```bash
        npm install
        ```

2.  **Set Environment Variables**

    Ensure you have an `.env` file with all required environment variables. These variables are critical for the app to function properly. You can find the list of required variables in the [Notion Docs](https://www.notion.so/Environment-variables-1224c1e60d2b80938a4cd40136adf4ad?pvs=4).

3.  **Start the Development Server**

    Launch the development server using:

    ```bash
    npm run dev
    ```

4.  **Access the App**

    Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

### Adding Icons to the IcoMoon Font

To integrate new icons into IcoMoon font, follow these steps. This method avoids managing icons in separate files or writing them as inline code, instead compiling them into a font, making them highly customizable and easy to use as class names.

#### Steps:

1. **Download the Icon(s)**  
   Export the desired icon(s) from the Figma design in `svg` format.

2. **Import the Project into IcoMoon**

   - Go to the [IcoMoon App](https://icomoon.io/app/#/projects).
   - Click on `Import Project`.
   - Select the `selection.json` file from `<repository folder>/public/Icons/selection.json`.

3. **Load the Project**

   - After importing, a new project (likely named "Untitled Project") will appear.
   - Click `Load` to view all the previously added icons in the project.

4. **Add New Icons**

   - Drag and drop the new `svg` icon(s) exported from Figma into the IcoMoon interface.
   - Select the uploaded icons to include them in the font.

5. **Generate the Font**

   - Click the `Generate Font` button at the bottom-right of the page.
   - Once the font is generated, click `Download` to save the font package as a `zip` file.

6. **Replace Font Files**

   - Unzip the downloaded font file.
   - Replace the following files in `<repository folder>/public/Icons/`:
     - Replace `selection.json` with the updated `selection.json` file from the root of the font folder.
     - Replace `coachbot-icons.ttf` and `coachbot-icons.woff` with the updated versions from the `fonts` folder in the zip-package.

7. **Update CSS for the New Icon**

   - Open the `style.css` file in the font files.
   - Find the CSS selector for the new icon. The class name will follow this pattern: `.cbi-<svg-filename>`
   - Copy this selector and add it to `<repository folder>/src/styles/icons.css`.

8. **Use the Icon in the Project**
   - Apply the new icon class to any HTML element.
   - Customize the icon using `font-size`, `color`, and other CSS properties.

## License

This site template is a commercial product and is licensed under the [Tailwind UI license](https://tailwindui.com/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
