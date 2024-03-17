export default function FormError(props: any) {
    return (
        <div>
            {props?.error?.map((item: any, index: any) => {
                return item.path == props.field ? (
                    <p key={index} className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">{item.message}</span>
                    </p>
                ) : (
                    ""
                );
            })}
        </div>
    );
}
