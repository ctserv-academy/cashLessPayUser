// Transactions.js
import React, { useState, useCallback, useMemo } from "react";
import TransactionItem from "./TransactionItem";
import "./Transactions.css";

function Transactions() {
  // Consolidated state management
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 5, // You can adjust this number
  });

  const transactions = [
    {
      id: 1,
      vendor: "Coffee Shop",
      timestamp: "2025-08-19T10:15:00",
      amount: -4.5,
      type: "spending",
    },
    {
      id: 2,
      vendor: "Top-Up via Visa",
      timestamp: "2025-08-18T14:30:00",
      amount: 50.0,
      type: "top-up",
    },
    {
      id: 3,
      vendor: "Supermarket",
      timestamp: "2025-08-17T17:45:00",
      amount: -28.75,
      type: "spending",
    },
    {
      id: 4,
      vendor: "Gas Station",
      timestamp: "2025-08-16T12:20:00",
      amount: -35.0,
      type: "spending",
    },
    {
      id: 5,
      vendor: "Restaurant",
      timestamp: "2025-08-15T19:30:00",
      amount: -22.5,
      type: "spending",
    },
    {
      id: 6,
      vendor: "Top-Up via Mastercard",
      timestamp: "2025-08-14T09:15:00",
      amount: 100.0,
      type: "top-up",
    },
    {
      id: 7,
      vendor: "Pharmacy",
      timestamp: "2025-08-13T16:45:00",
      amount: -15.25,
      type: "spending",
    },
    {
      id: 8,
      vendor: "Bookstore",
      timestamp: "2025-08-12T11:30:00",
      amount: -12.99,
      type: "spending",
    },
  ];

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const { currentPage, itemsPerPage } = state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    return {
      indexOfFirstItem,
      indexOfLastItem,
      currentTransactions,
      totalPages,
    };
  }, [state.currentPage, state.itemsPerPage, transactions]);

  // Handle page changes with useCallback
  const handlePageChange = useCallback((pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));
  }, []);

  // Generate page numbers for pagination with useCallback
  const getPageNumbers = useCallback(() => {
    const { currentPage, totalPages } = paginationData;
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  }, [paginationData]);

  // Check if we should show mobile-friendly pagination with useCallback
  const isMobile = useCallback(() => {
    return window.innerWidth <= 480;
  }, []);

  // Memoized page number buttons to prevent unnecessary re-renders
  const pageNumberButtons = useMemo(() => {
    return getPageNumbers().map((pageNumber, index) => (
      <button
        key={index}
        className={`page-number ${
          pageNumber === state.currentPage ? "active" : ""
        } ${pageNumber === "..." ? "ellipsis" : ""}`}
        onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
        disabled={pageNumber === "..."}
      >
        {pageNumber}
      </button>
    ));
  }, [getPageNumbers, state.currentPage, handlePageChange]);

  const { indexOfFirstItem, indexOfLastItem, currentTransactions, totalPages } =
    paginationData;

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transactions</h2>

      {/* Transactions List */}
      <div className="transactions-list">
        {currentTransactions.map((tx) => (
          <TransactionItem key={tx.id} {...tx} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, transactions.length)} of{" "}
            {transactions.length} transactions
          </div>

          <div className="pagination-controls">
            {/* Previous Button */}
            <button
              className={`pagination-btn ${
                state.currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(state.currentPage - 1)}
              disabled={state.currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers - Hidden on very small screens */}
            <div className="page-numbers desktop-only">{pageNumberButtons}</div>

            {/* Mobile-friendly page indicator */}
            <div className="mobile-page-indicator">
              Page {state.currentPage} of {totalPages}
            </div>

            {/* Next Button */}
            <button
              className={`pagination-btn ${
                state.currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(state.currentPage + 1)}
              disabled={state.currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
