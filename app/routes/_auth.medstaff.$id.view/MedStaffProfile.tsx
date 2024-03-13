import { Rating, ThinStar } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";
import { BsFillTelephoneFill,BsGenderAmbiguous, } from "react-icons/bs";
import { ViewFeedBack } from "./ViewFeedBack";
export default function MedStaffProfile({ data }: any) {
    const qualificationArr = data?.medStaff.qualification.split(".");
    const experiecneArr = data?.medStaff.experience.split(".");
    return (
        <div className="container mx-auto my-24">
            <div>
                <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6  lg:w-4/6 xl:w-3/6 mx-auto">
                    <div className="flex justify-center">
                        <img
                            src={
                                data?.medStaff.metadata.avatar ||
                                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                            }
                            alt=""
                            className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
                        />
                    </div>

                    <div className="mt-16">
                        <h1 className="font-bold text-center text-3xl text-gray-900">{data?.medStaff.metadata.name}</h1>
                        <div className="text-center text-sm text-gray-400 font-medium flex justify-center ">
                            <Rating
                                style={{ maxWidth: 150 }}
                                itemStyles={{ itemShapes: ThinStar, activeFillColor: "#ffb700", inactiveFillColor: "#fbf1a9" }}
                                value={data?.doctorAveragePoint}
                                readOnly
                            />
                        </div>
                        <div className="flex justify-center">
                            <a href="#" className=" text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">
                                {data?.totalFeedBack} Feedback
                            </a>
                        </div>
                        <p>
                            <span></span>
                        </p>
                        <div className="flex justify-center px-6 my-5">
                           <ViewFeedBack medstaffId={data?.medStaff.id}/>
                        </div>
                        <div className="flex justify-between items-center my-5 px-6"></div>

                        <div className="w-full">



                            <h3 className="font-medium text-gray-900 text-left px-6">Information</h3>


                            <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                                <div
                                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                                >
                                    <BsGenderAmbiguous className="inline-block mr-2" />
                                    Gender: <span className="font-bold">{data?.medStaff.metadata.gender ? "Male" : "Female"}</span>
                                </div>
                            </div>

                            <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                                <div
                                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                                >
                                    <BsFillTelephoneFill className="inline-block mr-2" />
                                    Phone Number: <span className="font-bold">{data?.medStaff.metadata.phoneNo}</span>
                                </div>
                            </div>

                            <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                                <div
                                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                                >
                                   
                                    Qualification:
                                    <ul className="ml-8 list-disc">
                                        {qualificationArr
                                            .filter((e: any) => e != null && e != " ")
                                            .map((e: any) => (
                                                <li key={e}>{e}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                                <div
                                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                                >
                                   
                                    Experience
                                    <ul className="ml-8 list-disc">
                                        {experiecneArr
                                            .filter((e: any) => e != null && e != " ")
                                            .map((e: any) => (
                                                <li key={e}>{e}</li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
