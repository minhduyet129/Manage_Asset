import { format } from "date-fns";

function HandleAPIUrl(pageNumber, sort, filterState, filterAssignedDate, searchText) {
    let url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    let assignedDate
    if (filterAssignedDate) assignedDate = format(new Date(filterAssignedDate), "dd/MM/yyyy")

    if (searchText && filterState >= 0 && filterAssignedDate) {
      url = `api/Assignments?PageNumber=${pageNumber}` + 
      `&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}` +
      `&keyword=${searchText}&filterState=${filterState}` + 
      `&assignedDate=${assignedDate}`;
    } 
    if (searchText && filterState >= 0 && !filterAssignedDate) {
      url = `api/Assignments?PageNumber=${pageNumber}` + 
      `&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}` +
      `&keyword=${searchText}&filterState=${filterState}`
    } 
    if (searchText && filterAssignedDate && filterState < 0) {
      url = `api/Assignments?PageNumber=${pageNumber}` + 
      `&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}` +
      `&keyword=${searchText}&assignedDate=${assignedDate}`
    }
    if (searchText && !filterAssignedDate && filterState < 0) {
      url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`
    }
    if (!searchText && filterAssignedDate && filterState >= 0) {
      url = `api/Assignments?PageNumber=${pageNumber}` + 
      `&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}` +
      `&filterState=${filterState}&assignedDate=${assignedDate}`;
    }
    if (filterState >= 0 && !searchText && !filterAssignedDate) {
      url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&filterState=${filterState}`;
    }
    if (filterAssignedDate && !searchText && filterState < 0) {
      url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&assignedDate=${assignedDate}`;
    }
    return url
  }

  export default HandleAPIUrl