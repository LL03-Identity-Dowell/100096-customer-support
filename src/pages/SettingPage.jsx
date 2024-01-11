// import React from "react";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Settings from "../component/settings";
import { useState } from "react";

const SettingPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <section className="my-7">
        <hr />
        <div className=" md:px-10 px-6">
          <div className="flex justify-between mt-8 mb-6">
            <div>
              <h3 className="font-semibold mb-3">Portfolio/Team Roles</h3>
              <div className="border border-slate-300   px-2 py-1 flex items-center  rounded-md ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-400 pr-1"
                />
                <input
                  type="text"
                  className="placeholder:text-sm  bg-transparent focus:outline-none  pl-2"
                  placeholder="Search for Portfolio name"
                />
              </div>
            </div>
            <div>
              <p className="text-sm">
                <span className="mr-2">
                  Showing 1 to {rowsPerPage} out of 15
                </span>
                {/* <FontAwesomeIcon icon={faChevronRight} /> */}
              </p>
            </div>
          </div>
          <Settings
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </section>
    </>
  );
};

export default SettingPage;
