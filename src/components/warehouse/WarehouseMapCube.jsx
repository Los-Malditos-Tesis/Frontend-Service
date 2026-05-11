import VideocamIcon from "@mui/icons-material/Videocam";

const WarehouseMapCube = ({
  location,
  isSelected,
  onClick,
  cameraCount = 0,
  x = 20,
  y = 20,
  width = 180,
  height = 28,
  depth = 90,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`warehouse-cube-button ${isSelected ? "is-selected" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        "--w": `${width}px`,
        "--h": `${height}px`,
        "--d": `${depth}px`,
      }}
    >
      <div className="warehouse-cube-scene">
        <div className="warehouse-cube-box">
          <div className="warehouse-cube-face warehouse-cube-front" />
          <div className="warehouse-cube-face warehouse-cube-back" />
          <div className="warehouse-cube-face warehouse-cube-right" />
          <div className="warehouse-cube-face warehouse-cube-left" />

          {/* TECHO */}
          <div className="warehouse-cube-face warehouse-cube-top">
            <div className="warehouse-cube-top-content">
              <p className="warehouse-cube-title">{location.zone}</p>

              <div className="warehouse-cube-camera-row">
                <div className="warehouse-cube-camera-info ">

                  <VideocamIcon sx={{ fontSize: 14 }} />
                  <span>
                    {cameraCount} {cameraCount === 1 ? "cámara" : "cámaras"}
                  </span>
                </div>


                {cameraCount > 0 && (
                  <div
                    className="camera-icon z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white  text-white shadow-lg"
                  >
                    <VideocamIcon sx={{ fontSize: 17 }} />
                  </div>
                )}
              </div>



            </div>
          </div>

          <div className="warehouse-cube-face warehouse-cube-bottom" />
        </div>
      </div>
    </button>
  );
};

export default WarehouseMapCube;