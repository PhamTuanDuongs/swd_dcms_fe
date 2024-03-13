import { type Examination, type Service } from "~/types";
import { Form } from "@remix-run/react";
import { FaEdit } from "react-icons/fa";
import { useRef, useState } from "react";

export function UpdateExamination({ services, examination }: { services: Service[]; examination: Examination }) {
    const inputFileref = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState("");
    const [checkRole, setRole] = useState(examination.service.id);
    const [selectedFile, setSelectedFile] = useState(false);

    const handleRoleChange = (e: any) => {
        const newRole = e.target.value;
        setRole(newRole);
    };
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
            setSelectedFile(true);
        }
    };
    return (
        <div>
            <div className="content flex mb-10">
                <div className="left-content w-96 h-98 ms-8  border-2 rounded shadow-xl">
                    <Form method="post" encType="multipart/form-data">
                        <div className="context m-8">
                            <div className="w-40 h-40">
                                {previewImage ? (
                                    <img className="rounded-lg w-40 h-40" src={previewImage} alt="Preview" />
                                ) : (
                                    <img
                                        className="rounded-lg w-40 h-40"
                                        src={
                                            examination?.imgResult
                                                ? examination?.imgResult
                                                : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                        }
                                        alt="Avatar"
                                    />
                                )}
                            </div>
                            <div className="edit-icon">
                                <label htmlFor="avatar" className="flex justify-start cursor-pointer" onClick={handleLabelClick}>
                                    <FaEdit className="edit-icon" size={25} /> Change avatar
                                    <input
                                        type="file"
                                        ref={inputFileref}
                                        name="avatar"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <input type="hidden" name="id" className="hidden" value={examination.id} />
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="mt-6 mb-8 flex items-center justify-center ">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                                    >
                                        Update Image
                                    </button>
                                </div>
                            )}
                        </div>
                    </Form>
                </div>
                <div className="rigth-content w-auto max-h-full border-2 rounded shadow-xl mx-8">
                    <Form replace method="post">
                        <div className="address mt-6 mx-8">
                            <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="service">
                                Service
                                <i className="text-red-600">*</i>
                            </label>
                            <br />
                            <select id="service" name="service" className="select border-separate border-x border-y bg-gray-200 w-40">
                                {services.map((service) => (
                                    <option
                                        key={service.id}
                                        selected={checkRole == service.id}
                                        value={service.id}
                                        onChange={handleRoleChange}
                                    >
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6 mx-8">
                            <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="result">
                                Result:
                                <i className="text-red-600">*</i>
                            </label>
                            <br />
                            <textarea id="result" defaultValue={examination.textResult} name="result" cols={100} rows={7}></textarea>
                            <input type="hidden" name="id" className="hidden" value={examination.id} />
                            <br />
                        </div>
                        <div className="mt-6 mb-8 flex items-center justify-center ">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                            >
                                Update Examination
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
