import React from "react";
import type { JobData } from "../types/models";
import { Link } from "react-router-dom";

type JobCardProps = {
  job: JobData;
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = () => {
    if (job.salaryNegotiable) return "Thỏa thuận";
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    if (job.salaryMin) {
      return `Từ ${job.salaryMin.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    if (job.salaryMax) {
      return `Tới ${job.salaryMax.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    return "Không rõ";
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <Link to={`/jobs/${job.slug}`}>
        <div className="flex items-center gap-3">
          <img
            src={job.images?.[0] || "/default-logo.png"}
            alt={job.title}
            className="w-14 h-14 object-contain rounded border"
          />
          <div>
            <h2 className="font-semibold text-base leading-snug">{job.title}</h2>
            {/* Tên công ty để trống */}
            <p className="text-sm text-gray-400 h-4"></p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700">
            {formatSalary()}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700">
            {job.location || "Không rõ"}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;
