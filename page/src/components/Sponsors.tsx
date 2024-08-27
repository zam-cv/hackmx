import { useEffect, useState } from "react";
import { SERVER } from "@/utils/constants";
import api, { type Sponsor } from "@/utils/api";

function Sponsor({
  url,
  name,
  width
}: {
  url: string,
  name: string,
  width: string
}) {
  return <img
    src={url}
    alt={name}
    className="h-16 mx-4 w-auto object-contain"
    style={{ width: `${width}%` }}
  />
}

export default function SponsorsCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    api.sponsors.list().then(setSponsors);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-start animate-infinite-scroll whitespace-nowrap gap-10" style={{ minWidth: '200%' }}>
        <Sponsor
          url={"tec.png"}
          name={"Tec de Monterrey"}
          width={`${100 / (sponsors.length + 1)}`}
        />
        {sponsors.map((sponsor, index) => (
          <Sponsor
            key={index}
            url={`${SERVER}/${sponsor.image}`}
            name={sponsor.name}
            width={`${100 / (sponsors.length + 1)}`}
          />
        ))}
        <Sponsor
          url={"tec.png"}
          name={"Tec de Monterrey"}
          width={`${100 / (sponsors.length + 1)}`}
        />
        {sponsors.map((sponsor, index) => (
          <Sponsor
            key={`duplicate-${index}`}
            url={`${SERVER}/${sponsor.image}`}
            name={sponsor.name}
            width={`${100 / (sponsors.length + 1)}`}
          />
        ))}
      </div>
    </div>
  );
}
