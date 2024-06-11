import { RectangleRadiusForm } from "../components/RectangleRadiusForm";

export default function Home() {
  return (
    <div className="p-16 flex justify-center">
      {/* <div className="border rounded-md p-6 border-solid w-full sm:w-64 bg-white shdaow-md"> */}
      <div className="border rounded-md p-6 border-solid bg-white shadow-md">
        <RectangleRadiusForm />
      </div>
    </div>
  );
}
