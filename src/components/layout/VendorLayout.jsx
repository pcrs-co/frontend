import { Outlet } from "react-router-dom";

export default function VendorLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Sidebar() {
  return <div>Sidebar</div>;
}