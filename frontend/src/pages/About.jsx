import Rating from "../components/Rating";

const About = () => {
  return (
    <div className=" flex flex-col items-center justify-start 
      bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200
      relative overflow-hidden">
      <div   className=" mt-24 p-6 rounded-3xl shadow-2xl
        bg-white/20 backdrop-blur-lg border border-white/30 
        flex flex-col justify-center gap-6 z-10 w-2/3"
        >
      <h1 className="text-3xl font-bold mb-4">About Heartoz</h1>
      <p className="mt-4  text-error">
       💗 Heartoz  is a thoughtfully designed platform for couples seeking to create
        memorable experiences together. From A to Z, each letter represents a unique
        date idea, encouraging partners to explore new activities, destinations, and
        shared hobbies.
      </p>
      <p className="mt-6  text-error">
       💗 Couples can upload photos for each date, building a visual diary of their
        adventures and milestones. This personalized approach not only inspires
        creativity but also strengthens connections by celebrating moments together.
      </p>
      <p className="mt-6  text-error">
       💗 With a seamless and secure user experience. Heartoz ensures privacy and reliability, making it easy for couples
        to plan, document, and cherish their shared journeys.
      </p>
      <p className="mt-6 pb-2  text-error">
       💗 Whether you’re planning your first date or celebrating years together, A2Z
        Date is your companion for meaningful, fun, and unforgettable experiences.
      </p>
    </div>
    <Rating />
    </div>
  );
};

export default About;
