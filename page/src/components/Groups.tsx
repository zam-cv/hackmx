import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

function Group({
  name,
  list,
  gap = 1,
}: {
  name: string;
  list: [string, string, string?][];
  gap?: number;
}) {
  return (
    <div className="bg-p-secondary-background rounded-lg p-4 py-6">
      <div className="text-center font-bold pb-4">{name}</div>
      <div className="flex flex-col gap-4" style={{ gap: `${gap}rem;` }}>
        {list.map(([name, email, role], i) => (
          <div key={i} className={`max-[450px]:gap-2 max-[420px]:grid-cols-1 ${role ? "grid grid-cols-[3fr_2fr] gap-8" : ""}`}>
            <p className="text-sm">
              {name}{" "}
              <span>
                (
                <a className="underline" href={"mailto:" + email}>
                  {email}
                </a>
                )
              </span>
            </p>
            {role && (
              <p className="text-sm flex justify-center items-center text-center max-[420px]:text-start max-[420px]:justify-start">
                {role}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Groups() {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 200: 1, 350: 1, 750: 1, 800: 1, 850: 1, 900: 2, 1200: 2, 1650: 3, 1700: 4 }}
    >
      <Masonry gutter="20px">
        <Group
          name="Coordinadores"
          list={[
            [
              "Alma Patricia Chávez Cervantes",
              "a012345678@tec.mx",
              "Coordinadora General",
            ],
            [
              "Fabrizio Martínez Chávez",
              "fabri04mx@hotmail.com",
              "Coordinador General",
            ],
            [
              "Carlos Alberto Zamudio Velázquez",
              "zam.cvz@gmail.com",
              "Coordinador en Página Web y Plataforma",
            ],
            [
              "Marla Daniela Alemán Sánchez",
              "marlaalesan024@gmail.com",
              "Coordinadora de Publicidad y Redes",
            ],
            [
              "Roger Vicente Rendon Cuevas",
              "renrooger@gmail.com",
              "Coordinador de Patrocinios",
            ],
            [
              "Kevin Santiago Castro Torres",
              "kecato17@gmail.com",
              "Coordinador de Logística",
            ],
            [
              "Vicente Jesús Ramos Chávez",
              "vicentejesusramos@gmail.com",
              "Coordinador de Vivencias",
            ],
            [
              "Leonardo David Cortés González",
              "a01749089@tec.mx",
              "Coordinador de Finanzas",
            ],
          ]}
        />
        <Group
          name="Página Web y Plataforma"
          list={[
            ["Eduardo Chavez Martin", "a01799595@tec.mx"],
            ["Renato García Morán", "rn0x7f@gmail.com"],
            ["Sebastián Antonio Almanza", "sebastian.antonio1707@gmail.com"],
            [
              "Yael Octavio Pérez Méndez",
              "perez.mendez.yael.octavio@gmail.com",
            ],
          ]}
          gap={0.5}
        />
        <Group
          name="Publicidad y Redes"
          list={[
            ["Vera Sofía Acevedo Gómez", "a01747156@tec.mx"],
            ["Paola Varela Hernández", "a01749596@tec.mx"],
            ["Andrea Elizabeth Román Varela", "a01749760@tec.mx"],
            ["Fernanda Ponce Maciel", "fernanda.ponce.maciel@gmail.com"],
          ]}
          gap={0.5}
        />
        <Group
          name="Patrocinios"
          list={[
            ["Maximiliano de la Cruz Lima", "a01798048@tec.mx"],
            ["Alejandra Estefania Rico Gonzalez", "a01749850@tec.mx"],
            ["Andrea Elizabeth Román Varela", "a01749760@tec.mx"],
            ["Ignacio Solís Montes", "solisignacio03@gmail.com"],
          ]}
          gap={0.5}
        />
        <div className="-mt-5"></div>
        <Group
          name="Logística"
          list={[
            ["Vera Sofía Acevedo Gómez", "a01747156@tec.mx"],
            ["Paola Varela Hernández", "a01749596@tec.mx"],
            ["Emiliano Caballero Mendoza", "a01749050@tec.mx"],
            ["José Eduardo Rosas Ponciano", "a01784461@tec.mx"],
          ]}
          gap={0.5}
        />
        <Group
          name="Vivencias"
          list={[
            ["Lizbeth Islas Becerril", "lizislasb@gmail.com"],
            ["Marla Daniela Alemán Sánchez", "marlaalesan024@gmail.com"],
            ["Fernanda Ponce Maciel", "fernanda.ponce.maciel@gmail.com"],
          ]}
          gap={0.5}
        />
        <Group
          name="Finanzas"
          list={[
            ["Denisse Contreras Solano", "a01749648@tec.mx"],
            ["Alejandra Martínez Chargoy", "a01750524@tec.mx"],
            ["Areli Ramírez García", "a01751085@tec.mx"],
            ["Dereck Zayd Ibarra Martínez", "a01752320@tec.mx"],
          ]}
          gap={0.5}
        />
      </Masonry>
    </ResponsiveMasonry>
  );
}
