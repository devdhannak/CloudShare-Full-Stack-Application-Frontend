import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints";
import { AlertCircle, Loader2, Receipt } from "lucide-react";
import { div } from "framer-motion/client";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(apiEndpoints.GET_TRANSACTIONS, {
          hef,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching transaction: ", error);
        setError(
          "Failed to load transactions history, Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [getToken]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toDateString(undefined, options);
  };

  const formatAmount = (amountInPaise) => {
    return `₹${(amountInPaise / 100).toFixed(2)}`;
  };

  return (
    <DashboardLayout activeMenu={"Transactions"}>
      <div className="p-6">
        <div
          className="flex items-center gep2
           mb-6"
        >
          <Receipt className="text-blue-600" />
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div>
            <Loader2 className="animate-spin" />
            <span>Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <Receipt size={48} className="mx-auto text-gray-400" />
            <h3>No transactions found.</h3>
            <p className="text-gray-50">
              You haven't made any credit purchase yet. Visit the Subscription
              page to buy credits.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase">
                    Credits Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase">
                    Payment ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.planId === "premium"
                        ? "Premium Plan"
                        : transaction.planId === "ultimate"
                          ? "Ultimate Plan"
                          : "Basic Plan"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.creditsAdded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.paymentId
                        ? transaction.paymentId.substring(0, 12) + "..."
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
