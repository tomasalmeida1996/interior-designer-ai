"use client";

import Dropzone from "react-dropzone";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FileRejection } from "react-dropzone";
import { ThreeDots } from "react-loader-spinner";
import { FaTrashAlt } from "react-icons/fa";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { SelectMenu } from "@/app/selectmenu";
import { ImageAreaProps } from "@/types";
import { models } from "@/config/models";
import type { ModelId } from "@/lib/models";
import { ROOMS, STYLES } from "@/lib/prompt-config";
import { ModelParameters } from "./components/ModelParameters";
import { AIModel, ModelValues } from "../types";
import { useHistory } from "./context/HistoryContext";
import { RecentHistory } from "./components/RecentHistory";
import { ImageWithActions } from "./components/ImageWithActions";
import { ExampleImages } from "./components/ExampleImages";

type ErrorNotificationProps = {
  errorMessage: string;
};

type ActionPanelProps = {
  isLoading: boolean;
  submitImage(): void;
};

type UploadedImageProps = {
  image: File;
  removeImage(): void;
  file: {
    name: string;
    size: string;
  };
};

type ImageOutputProps = ImageAreaProps & {
  loading: boolean;
  outputImage: string | null;
  downloadOutputImage(): void;
};

const themes = STYLES;
const rooms = ROOMS;

const acceptedFileTypes = {
  "image/jpeg": [".jpeg", ".jpg", ".png"],
};

const maxFileSize = 5 * 1024 * 1024; // 5MB

/**
 * Display an error notification
 * @param {ErrorNotificationProps} props The component props
 */
function ErrorNotification({ errorMessage }: ErrorNotificationProps) {
  return (
    <div className="mx-4 mb-10 rounded-md bg-red-50 p-4 lg:mx-6 xl:mx-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Display the action panel
 * @param {ActionPanelProps} props The component props
 */
function ActionPanel({ isLoading, submitImage }: ActionPanelProps) {
  const isDisabled = isLoading;

  return (
    <section className="mx-4 bg-gray-900 shadow sm:rounded-lg lg:mx-6 xl:mx-8">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base leading-6 font-semibold text-gray-300 lg:text-xl">
              Upload a photo or image
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Upload an image of a room and let our AI generate a new design.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              disabled={isDisabled}
              onClick={submitImage}
              className={`${
                isDisabled
                  ? "cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300"
                  : "bg-indigo-600 text-white"
              } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
            >
              Design this room
              <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Display the image output
 * @param {ImageOutputProps} props The component props
 */
function ImageOutput(props: ImageOutputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-[206px] w-full">
      <button
        type="button"
        className={`${
          props.loading ? "flex items-center justify-center" : ""
        } relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none`}
      >
        {!props.outputImage && props.loading ? (
          <span className="flex flex-col items-center">
            <ThreeDots
              height={50}
              width={60}
              color="#eee"
              ariaLabel="three-dots-loading"
              visible={props.loading}
            />
            <span className="block text-sm font-semibold text-gray-300">
              Processing the output image
            </span>
          </span>
        ) : null}

        {!props.outputImage && !props.loading ? (
          <>
            <props.icon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-gray-300">
              {props.title}
            </span>
          </>
        ) : null}

        {!props.loading && props.outputImage && (
          <ImageWithActions
            imageUrl={props.outputImage}
            alt="Generated output"
            filename="output.png"
            containerClassName="h-full"
          />
        )}
      </button>
    </section>
  );
}

/**
 * Display the uploaded image
 * @param {UploadedImageProps} props The component props
 */
function UploadedImage({ file, image, removeImage }: UploadedImageProps) {
  return (
    <section className="relative min-h-[206px] w-full">
      <button className="relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          className="h-full w-full object-cover"
        />
      </button>

      <button
        className="group absolute top-1 right-1 rounded bg-yellow-500 p-2 text-black"
        onClick={removeImage}
      >
        <FaTrashAlt className="h-4 w-4 duration-300 group-hover:scale-110" />
      </button>

      <div className="text-md bg-opacity-50 absolute top-0 left-0 p-2 pl-3.5 text-white">
        {file.name} ({file.size})
      </div>
    </section>
  );
}

/**
 * Display the image dropzone
 * @param {ImageAreaProps} props The component props
 */
function ImageDropzone(
  props: ImageAreaProps & {
    onImageDrop(acceptedFiles: File[], rejectedFiles: FileRejection[]): void;
  }
) {
  return (
    <Dropzone
      onDrop={props.onImageDrop}
      accept={acceptedFileTypes}
      maxSize={maxFileSize}
      multiple={false}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          <input {...getInputProps()} />
          <button
            {...getRootProps()}
            type="button"
            className="relative block min-h-[206px] w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <props.icon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-gray-300">
              {props.title}
            </span>
          </button>
        </>
      )}
    </Dropzone>
  );
}

/**
 * Display the home page
 */
const defaultUiModel =
  models.find((m) => m.apiModelId === "adirik") ?? models[0];

export default function HomePage() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(themes[0]);
  const [room, setRoom] = useState<string>(rooms[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(defaultUiModel);
  const [modelId, setModelId] = useState<ModelId>(defaultUiModel.apiModelId);
  const [modelValues, setModelValues] = useState<ModelValues>({});
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);
  const { historyItems, addHistoryItem } = useHistory();

  /**
   * Handle the image drop event
   * @param {Array<File>} acceptedFiles The accepted files
   * @param {Array<FileRejection>} rejectedFiles The rejected files
   * @returns void
   */
  function onImageDrop(
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ): void {
    // Check if any of the uploaded files are not valid
    if (rejectedFiles.length > 0) {
      console.info(rejectedFiles);
      setError("Please upload a PNG or JPEG image less than 5MB.");
      return;
    }

    removeImage();

    console.info(acceptedFiles);
    setError("");
    setFile(acceptedFiles[0]);

    // Convert to base64
    convertImageToBase64(acceptedFiles[0]);
  }

  /**
   * Convert the image to base64
   * @param {File} file The file to convert
   * @returns void
   */
  function convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setBase64Image(binaryStr);
    };
  }

  /**
   * Convert the file size to a human-readable format
   * @param {number} size The file size
   * @returns {string}
   */
  function fileSize(size: number): string {
    if (size === 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Remove the uploaded image
   * @returns void
   */
  function removeImage(): void {
    setFile(null);
    setOutputImage(null);
  }

  /**
   * Download the output image
   * @returns void
   */
  function downloadOutputImage(): void {
    saveAs(outputImage as string, "output.png");
  }

  /**
   * Submit the image to the server
   * @returns {Promise<void>}
   */
  async function submitImage(): Promise<void> {
    if (!file) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);

    const requestBody = {
      modelId,
      image: base64Image,
      theme,
      room,
      parameters: modelValues,
    };

    const response = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log(result);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setOutputImage(result.output);
    setMaskImage(typeof result.mask === "string" ? result.mask : null);
    setLoading(false);

    // Add to history
    if (base64Image && result.output) {
      addHistoryItem({
        inputImage: base64Image,
        outputImage: result.output,
        roomType: room,
        theme,
      });
    }
  }

  function handleParameterChange(name: string, value: any) {
    setModelValues((prev: ModelValues) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleExampleImageSelect = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = imageUrl.split("/").pop() ?? "example.jpg";
      const file = new File([blob], filename, { type: "image/jpeg" });

      setFile(file);
      convertImageToBase64(file);
    } catch (error) {
      console.error("Error loading example image:", error);
      setError("Failed to load example image");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData("text/plain");
    console.log("🚀 ~ handleDrop ~ imageUrl:", imageUrl);
    if (imageUrl.startsWith("/assets/")) {
      handleExampleImageSelect(imageUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <main className="flex min-h-screen flex-col bg-black py-10 lg:pl-72">
      {error ? <ErrorNotification errorMessage={error} /> : null}

      <section className="mx-4 lg:mx-6 xl:mx-8">
        <div className="mb-6">
          <h3 className="text-base leading-6 font-semibold text-gray-300 lg:text-xl">
            Upload a photo or image
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Upload an image of a room and let our AI generate a new design.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-2 text-sm font-medium text-gray-400">
            Or choose from our example images:
          </h4>
          <ExampleImages onImageSelect={handleExampleImageSelect} />
        </div>

        <div className="mt-4 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                For better results, please use JPG or JPEG images. Some models
                may not work well with other formats.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6" onDrop={handleDrop} onDragOver={handleDragOver}>
          {!file && selectedModel.requiresImage ? (
            <ImageDropzone
              title={`Drag 'n drop your image here or click to upload`}
              onImageDrop={onImageDrop}
              icon={PhotoIcon}
            />
          ) : file ? (
            <UploadedImage
              image={file}
              removeImage={removeImage}
              file={{ name: file.name, size: fileSize(file.size) }}
            />
          ) : null}
        </div>
      </section>

      <section className="mx-4 mt-9 space-y-4 lg:mx-6 xl:mx-8">
        <div className="w-full">
          <SelectMenu
            label="Model"
            options={models.map((m) => m.name)}
            selected={selectedModel.name}
            onChange={(name) => {
              const model = models.find((m) => m.name === name);
              if (model) {
                setSelectedModel(model);
                setModelId(model.apiModelId);
                setModelValues({}); // Reset values when model changes
                setShowAdvancedOptions(false); // Hide advanced options when model changes
              }
            }}
          />
        </div>

        {selectedModel.parameters.length > 0 && (
          <div className="mt-6">
            <ModelParameters
              parameters={selectedModel.parameters}
              values={modelValues}
              onChange={handleParameterChange}
              showAdvanced={showAdvancedOptions}
              onToggleAdvanced={() =>
                setShowAdvancedOptions(!showAdvancedOptions)
              }
            />
          </div>
        )}

        {!showAdvancedOptions && (
          <div className="mt-6 flex flex-row gap-2 sm:grid-cols-2">
            {selectedModel.requiresRoomType && (
              <SelectMenu
                label="Room type"
                options={rooms}
                selected={room}
                onChange={setRoom}
              />
            )}
            {selectedModel.requiresStyle && (
              <SelectMenu
                label="Style"
                options={themes}
                selected={theme}
                onChange={setTheme}
              />
            )}
          </div>
        )}

        <div className="mt-10 flex justify-start">
          <button
            type="button"
            disabled={loading}
            onClick={submitImage}
            className={`${
              loading
                ? "cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
          >
            Design this room
            <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
          </button>
        </div>
      </section>

      <section className="mx-4 mt-10 lg:mx-6 xl:mx-8">
        {(loading || outputImage) && (
          <ImageOutput
            title={`AI-generated output goes here`}
            downloadOutputImage={downloadOutputImage}
            outputImage={outputImage}
            icon={SparklesIcon}
            loading={loading}
          />
        )}

        {selectedModel.hasMask && outputImage && (
          <div className="mt-6">
            <ImageOutput
              title={`AI-generated mask output`}
              downloadOutputImage={() =>
                saveAs(maskImage as string, "mask.png")
              }
              outputImage={maskImage}
              icon={SparklesIcon}
              loading={loading}
            />
          </div>
        )}
      </section>

      <section className="mx-4 mt-10 lg:mx-6 xl:mx-8">
        <RecentHistory items={historyItems} />
      </section>
    </main>
  );
}
