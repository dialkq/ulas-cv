"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return <p>File not found</p>;
    }
    const file = event.target.files?.[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        console.log(reader.result);
        setImage(reader.result);
      }
    };

    reader.onerror = (error) => {
      console.log(error);
    };
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:px-5">
      {/* KOMPONEN UPLOAD */}
      <div className="w-[90%] md:w-[35%] flex flex-col my-5 mx-auto justify-center bg-white rounded-xl shadow-md animate-fadeIn">
        <p className="font-bold text-center my-8 text-xl font-sans text-slate-950">
          Ayo Ulas CV Kamu!
        </p>

        {/* SHOW IMAGE */}
        {image !== "" ? (
          <div className="w-full h-40 overflow-hidden">
            <Image
              src={image}
              width={300}
              height={300}
              alt="CV"
              className="mx-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex mx-auto">
            <p>Hasil Upload CV / Resume</p>
          </div>
        )}

        {/* Form */}
        <form className="w-[85%] mx-auto" onSubmit={handleSubmit}>
          <div className="flex flex-col mt-3">
            <label className="text-sm font-sans font-bold mb-2 text-slate-800">
              CV / Resume
            </label>
            <input
              type="file"
              name="file"
              className="border text-sm border-black rounded-md cursor-pointer"
              required
              onChange={(e) => handleFileChange(e)}
            />
          </div>

          <div className="flex w-28 md:w-32 my-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-300 ease-in-out">
            <button
              type="submit"
              className="text-center mx-auto font-semibold text-xs md:text-sm p-2 md:p-2.5"
            >
              Ulas Sekarang
            </button>
          </div>
        </form>
      </div>

      {/* BUBLE CHATGPT */}
      <div className="w-11/12 md:w-[60%] lg:w-[62%] md:my-5 mx-auto bg-white rounded-lg">
        <p className="w-11/12 text-center">Hasil Ulas</p>
      </div>
    </div>
  );
}
