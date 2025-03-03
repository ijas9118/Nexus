const SearchDropdown = ({
  searchResults,
  onSelect,
}: {
  searchResults: any;
  onSelect: any;
}) => {
  return (
    <div className="absolute top-28 left-4 right-4 bg-background border rounded-lg shadow-lg z-10">
      {searchResults.map((connection: any) => (
        <div
          key={connection._id}
          className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
          onClick={() => onSelect(connection)}
        >
          <div className="flex items-center gap-2">
            <img
              src={connection.avatar}
              alt={connection.name}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="font-medium">{connection.name}</p>
              <p className="text-sm text-muted-foreground">@{connection.username}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;
