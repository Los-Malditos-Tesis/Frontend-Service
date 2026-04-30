import { motion } from "framer-motion";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const LoginLayout = ({ children }) => {
  return (
    <div className="login-bg / w-full h-screen flex justify-center items-center">
      <div className="z-10 relative max-w-[70rem] max-h-[50rem] w-full h-full flex rounded-2xl overflow-hidden shadow-lg bg-white">
        {/* LEFT */}
        <div className="hidden md:flex w-1/2 relative p-8 flex-col justify-between  text-white overflow-hidden">
          <span className=""></span>
          {/* <h2 className="text-4xl font-extrabold mb-4 z-10">
            Bienvenido!
          </h2> */}

          <div className="z-10 flex gap-3 items-center">
            <div className="bg-black p-2 w-10 h-10 flex items-center justify-center">
              <Inventory2OutlinedIcon className="text-white" fontSize="medium" />
            </div>

            <h1 className="text-2xl text-center font-bold">
              Logistics{" "}
              <span className="text-accent_color">
                Vision
              </span>
            </h1>
          </div>

          {/* <h2 className="z-10 text-6xl">
            Logi
            <span className="text-6xl text-accent_color font-bold ">Vision</span>
          </h2> */}
          {/* 
          <p className="text-lg z-10">
            Ingresa tus credenciales para acceder a tu cuenta
          </p> */}
        </div>

        {/*  imagen hero  */}
        <div className="w-[55%] absolute z-0 bg-[#0f172a] inset-0">

          <img
            src="https://img.freepik.com/foto-gratis/inventario-almacen_23-2151938383.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Login Illustration"
            className="absolute z-0 opacity-70 bg-[#0f172a] h-full aspect-cover object-cover inset-0 blur-xs"
          />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#ffffff] z-10 p-10 rounded-3xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;