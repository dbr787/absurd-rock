import { RectangleRadiusForm } from "../components/RectangleRadiusForm";
import ResizableRectangle from "../components/ResizableRectangle";
import ResizableRectangle2 from "../components/ResizableRectangle2";

export default function Home() {
  return (
    <div className="p-16 flex flex-col justify-center items-center">
      <div className="border rounded-md p-6 border-solid bg-white shadow-md">
        <RectangleRadiusForm />
        {/* <ResizableRectangle
          initialWidth={100}
          initialHeight={100}
        /> */}
        <div className="">
          <ResizableRectangle2 />
        </div>
      </div>
    </div>
  );
}
// export default function Home() {
//   return <ResizableRectangle2 />;
// }
