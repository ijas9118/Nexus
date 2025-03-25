import NewDM from "./NewDM";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[30vw] lg:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full ">
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <div className="uppercase tracking-wide text-muted-foreground pl-10 font-normal text-xs">
            Direct Messages
          </div>
          <NewDM />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <div className="uppercase tracking-wide text-muted-foreground pl-10 font-normal text-xs">
            Channels
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsContainer;
