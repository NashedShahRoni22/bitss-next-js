import Image from "next/image";
import SectionContainer from "../shared/SectionContainer";
import SectionTitle from "../shared/SectionTitle";
import SectionSubTitle from "../shared/SectionSubTitle";

export default function Vision() {
  return (
    <SectionContainer>
      <SectionTitle>Our Mission & Vision</SectionTitle>
      <SectionSubTitle>
        Learn more about how we protect businesses and individuals with our
        cutting-edge cybersecurity solutions.
      </SectionSubTitle>

      <div className="mt-20 flex flex-col gap-8 md:flex-row md:items-center md:gap-16">
        {/* Mission & Vision Container */}
        <div className="w-full space-y-8 md:w-1/2">
          {/* Mission */}
          <div className="rounded-lg px-6 py-8 shadow">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/images/icons/mission.png"
                alt="bitss mission"
                width={32}
                height={32}
              />
              <h3 className="text-2xl font-bold md:text-3xl">Our Mission</h3>
            </div>
            <p className="mb-4">
              With a team of highly skilled research engineers, we deploy
              cutting-edge technology to combat online hacking, piracy, virus
              warfare, and cybercrime.
            </p>
            <p>
              Our research is ongoing, driven by a mission to stay ahead of
              evolving cyber threats.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-lg px-6 py-8 shadow">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/images/icons/vision.png"
                alt="bitss vision"
                width={32}
                height={32}
              />
              <h3 className="text-2xl font-bold md:text-3xl">Our Vision</h3>
            </div>
            <p className="mb-4">
              Our vision is to deliver the absolute best security solutions to
              our customers, ensuring their safety and peace of mind at every
              step.
            </p>
            <p>
              We are committed to excellence, innovation, and personalized
              service, empowering businesses to thrive securely in a dynamic
              digital landscape.
            </p>
          </div>
        </div>

        {/* Video Container */}
        <div className="w-full md:w-1/2">
          <div className="aspect-video w-full max-w-3xl">
            <iframe
              className="h-full w-full rounded-lg"
              src="https://www.youtube.com/embed/C9XBLzhUk3Q?si=Zp8FWOY2CxJZKp7x"
              title="Our Mission and Vision"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
