import { useEffect, useState } from "react";
import { List, Plus, X } from "lucide-react";

function Breadcrumb() {
  const [tabs, setTabs] = useState([
    { id: 1, label: "Customer 1", active: true },
  ]);

  const [nextId, setNextId] = useState(2); // Initialize next ID counter

  const addTab = () => {
    if (tabs.length >= 3) {
      // Limit tabs to 3
      return;
    }
    const newTab = {
      id: nextId, // Use nextId for new tab ID
      label: `Customer ${nextId}`,
      active: false,
    };
    setTabs([...tabs, newTab]);
    setNextId(nextId + 1); // Increment nextId for the next tab
  };

  const removeTab = (idToRemove: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== idToRemove);

    // Check if the removed tab was active
    const removedTab = tabs.find((tab) => tab.id === idToRemove);
    if (removedTab && removedTab.active && newTabs.length > 0) {
      // Find the first tab after the removed tab to set as active
      const firstTabAfterRemove = newTabs.find((tab) => tab.id > idToRemove);
      if (firstTabAfterRemove) {
        firstTabAfterRemove.active = true;
      } else {
        // If no tab after the removed one, set the last tab as active
        newTabs[newTabs.length - 1].active = true;
      }
    }

    setTabs(newTabs);
  };

  const switchTab = (id: number) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        active: tab.id === id,
      }))
    );
  };

  // Time and date
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="flex w-full h-full justify-between items-center mt-2">
      <div className=" flex gap-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex ${
              tab.active ? "bg-[#464343]" : "bg-[#CECFD2]"
            } gap-2 justify-between items-center px-2 w-[291px] h-[31px] cursor-pointer`}
            onClick={() => switchTab(tab.id)}>
            <div className="flex gap-2 items-center">
              <List
                size={18}
                className={`text-white ${tab.active ? "" : "text-[#272727]"}`}
              />
              <p className={`text-white ${tab.active ? "" : "text-[#272727]"}`}>
                {tab.label}
              </p>
            </div>
            {tab.active && tabs.length > 1 && (
              <X
                size={20}
                className="text-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Stop propagation to prevent triggering switchTab
                  removeTab(tab.id);
                }}
              />
            )}
          </div>
        ))}

        {tabs.length < 3 && (
          <div
            className="flex justify-center items-center w-[31px] h-[31px] bg-[#478BA1] cursor-pointer"
            onClick={addTab}>
            <Plus size={22} className="text-white" />
          </div>
        )}
      </div>

      <div className="pr-1">
        <p className="text-[16px] font-normal">{formatDateTime(dateTime)}</p>
      </div>
    </div>
  );
}

export default Breadcrumb;
