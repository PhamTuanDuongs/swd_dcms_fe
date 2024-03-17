import { useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Form } from "@remix-run/react";

import { type Service } from "~/types";

export function AddExamination({ services, appId }: { services: Service[]; appId: string }) {
    const inputFileref = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState("");
    const handleLabelClick = () => {
        if (inputFileref.current) {
            inputFileref.current.click();
        }
    };
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreviewImage(imageURL);
        }
    };
    return (
        <div>
            <div className="flex items-center justify-center mb-20 mt-10 w-auto">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Add Examination Results</h1>
            </div>
            <div className="flex items-center justify-center mb-20 mt-10 w-auto">
                <div className="rigth-content max-h-full border-2 rounded shadow-xl ">
                    <Form method="post" encType="multipart/form-data">
                        <div className="context m-8">
                            <div className="w-full mt-6 flex flex-col items-center">
                                <div className="w-40 h-40">
                                    {previewImage ? <img className="rounded-lg w-40 h-40" src={previewImage} alt="Preview" /> : null}
                                </div>
                                <div className="edit-icon">
                                    <label htmlFor="avatar" className="flex justify-start cursor-pointer" onClick={handleLabelClick}>
                                        <FaEdit className="edit-icon" size={25} /> Choose file
                                        <input
                                            type="file"
                                            ref={inputFileref}
                                            name="avatar"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <i className="text-xs">The maximum file size allowed is 5MB.</i>
                            </div>
                        </div>
                        <div className="mt-6 mx-8">
                            <label className="text-violet11 w-[130px] text-[15px] font-bold block" htmlFor="service">
                                Service<label className="text-red-600">*</label>
                            </label>
                            <select id="service" name="service" className="select border-separate border-x border-y bg-gray-200 w-40">
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6 mx-8">
                            <label className="text-violet11 w-[130px] text-[15px] font-bold" htmlFor="result">
                                Result:
                                <i className="text-red-600">*</i>
                            </label>
                            <br />
                            <textarea id="result" name="result" cols={100} rows={7}></textarea>
                            <br />
                        </div>
                        <div className="mt-6 mb-8 mx-8 flex items-center justify-center ">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                            >
                                Add Examination
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
