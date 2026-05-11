import AddIcon from "@mui/icons-material/Add";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import VideocamIcon from "@mui/icons-material/Videocam";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StorageIcon from "@mui/icons-material/Storage";
import WarehouseMapCube from "../../components/warehouse/WarehouseMapCube";

// const getLocationPosition = (index) => {
//   const positions = [
//     { x: 12, y: 18 },
//     { x: 33, y: 79 },
//     { x: 55, y: 146 },

//     { x: 12, y: 145 },
//     { x: 33, y: 210 },
//     { x: 55, y: 270 },

//     { x: 12, y: 270 },
//     { x: 33, y: 340 },
//     { x: 55, y: 410 },

//     { x: 12, y: 400 },
//     { x: 33, y: 470 },
//     { x: 55, y: 540 },

//     { x: 12, y: 540 },
//     { x: 33, y: 610 },
//     { x: 55, y: 680 },

//   ];

//   return positions[index % positions.length];
// };

// const getLocationPosition = (index) => {
//   const xValues = [11, 33, 55];

//   const col = index % 3;              // 0, 1, 2
//   const row = Math.floor(index / 3);  // grupo de 3
//   const topPadding = 50; // espacio superior para el header

//   return {
//     x: xValues[col],
//     y: topPadding + row * 130 + col * 64,
//   };
// };

const getLocationPosition = (index, total) => {
  // Pocas zonas: centradas en el mapa
  if (total === 1) {
    return { x: 34, y: 112 };
  }

  if (total === 2) {
    const positions = [
      { x: 34, y: 112 },
      { x: 56, y: 178 },
    ];

    return positions[index];
  }

  // Distribución normal para 3 o más
   const xValues = [11, 33, 55];

  const col = index % 3;              // 0, 1, 2
  const row = Math.floor(index / 3);  // grupo de 3
  const topPadding = 50; // espacio superior para el header

  return {
    x: xValues[col],
    y: topPadding + row * 130 + col * 64,
  };
};



// const getLocationPosition = (index) => {
//   const positions = [
//     { x: 12, y: 18, w: 18, h: 14 },
//     { x: 36, y: 12, w: 24, h: 12 },
//     { x: 66, y: 18, w: 20, h: 14 },
//     { x: 16, y: 48, w: 22, h: 16 },
//     { x: 48, y: 44, w: 24, h: 18 },
//     { x: 72, y: 52, w: 18, h: 16 },
//     { x: 26, y: 72, w: 24, h: 14 },
//     { x: 58, y: 72, w: 26, h: 14 },
//   ];

//   return positions[index % positions.length];
// };
const WarehouseMapViewer = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onEditLocation,
  onDeleteLocation,
  onAddLocation,
}) => {
  const selectedLocation = locations?.find((loc) => loc.id === selectedLocationId);

  if (!locations || locations.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100">
            <WarehouseIcon className="text-gray-400" fontSize="large" />
          </div>
        </div>

        <p className="mb-2 text-lg font-bold text-gray-700">Bodega Sin Zonas</p>
        <p className="mb-6 text-gray-500">
          Comienza creando tu primera zona de almacenamiento
        </p>

        <button
          onClick={onAddLocation}
          className="inline-flex items-center gap-2 rounded-lg bg-accent_color px-6 py-2.5 font-bold text-white transition hover:shadow-md"
        >
          <AddIcon fontSize="small" />
          Crear Zona
        </button>
      </div>
    );
  }

  const totalCameras = locations.reduce(
    (sum, loc) => sum + (loc.Cameras?.length || 0),
    0
  );

  const multiplier = 40;

  const multipliedLocations = Array.from({ length: multiplier })
    .flatMap(() => locations);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold text-secondary_color">
            {/* <WarehouseIcon className="text-gray-600" /> */}
            Mapa de Ubicaciones
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Vista visual de zonas, cámaras y estado de monitoreo
          </p>
        </div>


        <button
          onClick={onAddLocation}
          className="flex items-center gap-2 rounded-lg bg-accent_color px-4 py-2 text-sm font-bold text-white transition hover:shadow-md"
        >
          <AddIcon fontSize="small" />
          Nueva Zona
        </button>
      </div>

      <div > {/* className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]" */}

        {/* MAPA  */}
        {/* "relative min-h-[560px] overflow-hidden rounded-3xl border border-gray-200 bg-[#eef1f3] shadow-sm" */}
        <div className="relative min-h-[560px] overflow-auto rounded-3xl border border-gray-200 bg-[#eef1f3] shadow-sm">
          {/* Header flotante */}
          <div className="absolute right-5 top-5 z-30 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Warehouse overview
            </p>
            <p className="text-sm font-bold text-gray-700">
              {locations.length} zonas · {totalCameras} cámaras
            </p>
          </div>

          {/* Líneas de pasillos */}
          <div className="pointer-events-none absolute left-[0px] top-[0px] h-full w-full overflow-hidden pasillos">
            {Array.from({ length: 80 }).map((_, index) => (
              <div
                key={`pasillo-a-${index}`}
                className="absolute top-[10px] left-[-50%] h-[6px] w-[220%] bg-white/80"
                style={{
                  top: `${index * 227 + 26}px`,
                  transform: "rotate(-33deg)",
                }}
              />
            ))}

            {Array.from({ length: 60 }).map((_, index) => (
              <div
                key={`pasillo-b-${index}`}
                className="absolute top-[-50%] h-[220%] w-[6px] bg-white/60"
                style={{
                  left: `${index * 370}px`,
                  transform: "rotate(-57deg)",
                }}
              />
            ))}
          </div>


          {/* className="relative z-20 flex flex-wrap gap-x-20 gap-y-16 px-12 pt-28 pb-16" */}
          {/* nuevov "relative z-20 flex flex-wrap  gap-y-16 px-12 pt-28 pb-16"  */}
          <div className="min-w-[750px] relative z-20 flex flex-wrap  gap-y-16 px-12 pt-28 pb-16">

            {locations.map((location, index) => {
              const pos = getLocationPosition(index, locations.length);
              const cameraCount = location.Cameras?.length || 0;
              const isSelected = selectedLocationId === location.id;


              return (
                <WarehouseMapCube
                  key={location.id}
                  location={location}
                  isSelected={isSelected}
                  cameraCount={cameraCount}
                  onClick={() => onSelectLocation(location)}
                  x={pos.x}
                  y={pos.y}

                  // width={180}
                  // height={24}
                  // depth={90}
                  width={200}
                  height={20}
                  depth={200}
                />
              );
            })}
          </div>


          {/* Cámaras como puntos flotantes */}
          {/* {locations.map((location, index) => {
            const pos = getLocationPosition(index);
            const cameraCount = location.Cameras?.length || 0;

            if (cameraCount === 0) return null;

            return (
              <div
                key={`camera-${location.id}`}
                className="absolute z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gray-900 text-white shadow-lg"
                style={{
                  left: `${pos.x + pos.w - 2}%`,
                  top: `${pos.y - 2}%`,
                }}
              >
                <VideocamIcon sx={{ fontSize: 17 }} />
              </div>
            );
          })} */}

          {/* Popup de selección */}
          {selectedLocation && (
            <div className="absolute bottom-5 left-5 z-40 w-[340px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <StorageIcon className="text-secondary_color" />
                  </div>

                  <div>
                    <p className="font-black text-gray-800">
                      {selectedLocation.zone}
                    </p>
                    <p className="text-xs font-semibold text-gray-400">
                      Zona seleccionada
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    rounded-full px-2.5 py-1 text-xs font-black
                    ${(selectedLocation.Cameras?.length || 0) > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  {(selectedLocation.Cameras?.length || 0) > 0
                    ? "Online"
                    : "Sin cámaras"}
                </span>
              </div>

              {/* <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-purple-500">
                  AI Insight
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Esta zona tiene {selectedLocation.Cameras?.length || 0} cámaras
                  conectadas para monitoreo.
                </p>
              </div> */}

              <div className="flex gap-2">
                <button
                  onClick={() => onEditLocation(selectedLocation)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                  Editar
                </button>

                <button
                  onClick={() => onDeleteLocation(selectedLocation)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                  Eliminar
                </button>
              </div>
            </div>
          )}

          {/* Controles tipo mapa */}
          {/* <div className="absolute bottom-5 right-5 z-40 flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <button className="px-4 py-2 text-xl font-bold text-gray-500 hover:bg-gray-50">
              −
            </button>
            <div className="w-px bg-gray-200" />
            <button className="px-4 py-2 text-xl font-bold text-gray-500 hover:bg-gray-50">
              +
            </button>
          </div> */}
        </div>

        {/* PANEL DERECHO */}
        {/* <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Resumen
              </p>
              <h4 className="text-xl font-black text-gray-800">
                Estado de Bodega
              </h4>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
              <WarehouseIcon className="text-gray-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">Zonas</p>
              <p className="mt-1 text-2xl font-black text-gray-800">
                {locations.length}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">Cámaras</p>
              <p className="mt-1 text-2xl font-black text-accent_color">
                {totalCameras}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">Monitoreadas</p>
              <p className="mt-1 text-2xl font-black text-emerald-600">
                {
                  locations.filter((loc) => (loc.Cameras?.length || 0) > 0)
                    .length
                }
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-400">Sin cámaras</p>
              <p className="mt-1 text-2xl font-black text-gray-400">
                {
                  locations.filter((loc) => (loc.Cameras?.length || 0) === 0)
                    .length
                }
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-black text-gray-700">
              Zonas recientes
            </p>

            <div className="space-y-2">
              {locations.slice(0, 5).map((location) => (
                <button
                  key={location.id}
                  onClick={() => onSelectLocation(location)}
                  className={`
                    flex w-full items-center justify-between rounded-xl border p-3 text-left transition
                    ${
                      selectedLocationId === location.id
                        ? "border-accent_color bg-accent_color/5"
                        : "border-gray-100 hover:bg-gray-50"
                    }
                  `}
                >
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      {location.zone}
                    </p>
                    <p className="text-xs text-gray-400">
                      {location.Cameras?.length || 0} cámaras
                    </p>
                  </div>

                  <div
                    className={`
                      h-2.5 w-2.5 rounded-full
                      ${
                        (location.Cameras?.length || 0) > 0
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }
                    `}
                  />
                </button>
              ))}
            </div>
          </div>
        </aside> */}
      </div>
    </div>
  );
};

export default WarehouseMapViewer;