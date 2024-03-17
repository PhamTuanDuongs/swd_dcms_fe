import { Rating, ThinStar } from "@smastrom/react-rating";

export function CommentComponent({ comment, patient, doctorPoint }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-4 antialiased flex max-w-lg">
            <img
                className="rounded-full h-8 w-8 mr-2 mt-1 "
                src={
                    patient.avatar ||
                    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                }
            />
            <div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
                    <div className="font-semibold text-sm leading-relaxed">{patient.name}</div>
                    <div className="text-normal leading-snug md:leading-normal">{comment}</div>
                    <div className="text-normal leading-snug md:leading-normal">
                        <Rating
                            style={{ maxWidth: 100 }}
                            itemStyles={{ itemShapes: ThinStar, activeFillColor: "#ffb700", inactiveFillColor: "#fbf1a9" }}
                            value={doctorPoint}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
