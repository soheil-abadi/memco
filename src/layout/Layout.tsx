import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="duration-500 flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
      <main className="flex-grow max-w-[5000px] m-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
