import NewDM from "./NewDM";

const ContactsContainer = () => {
  return (
    <div className="md:w-[25vw] lg:w-[20vw] border-r w-full h-full">
      <div className="py-5">
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
