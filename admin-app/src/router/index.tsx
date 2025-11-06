import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import JobsList from '../pages/Jobs/index.tsx'
import CreateJob from './../pages/Jobs/CreateJob';
import JobDetail from '../pages/Jobs/JobDetail';
import EditJob from '../pages/Jobs/EditJob';
import JobCategoriesList from '../pages/JobCategories/index.tsx';
import CreateJobCategory from '../pages/JobCategories/CreateJobCategory';
import EditJobCategory from '../pages/JobCategories/EditJobCategory';
import JobCategoryDetail from '../pages/JobCategories/JobCategoryDetail';
import AccountsList from '../pages/Accounts/index.tsx';
import CreateAccount from '../pages/Accounts/CreateAccount';
import AccountDetail from '../pages/Accounts/AccountDetail';
import EditAccount from '../pages/Accounts/EditAccount';
import RolesList from '../pages/Roles/index.tsx';
import CreateRole from '../pages/Roles/CreateRole';
import RoleDetail from '../pages/Roles/RoleDetail';
import EditRole from '../pages/Roles/EditRole';
import { CVSamplesList, CreateCVSample, EditCVSample, CVSampleDetail } from '../pages/CVSamples';
import SiteSettingsPage from '../pages/Settings/SiteSettings';
import BlogsList from '../pages/Blogs/index.tsx';
import CreateBlog from '../pages/Blogs/CreateBlog';
import EditBlog from '../pages/Blogs/EditBlog';
import JobPackagesList from '../pages/JobPackages/index.tsx';
import CreateJobPackage from '../pages/JobPackages/CreateJobPackage';
import EditJobPackage from '../pages/JobPackages/EditJobPackage';
import BannerPackagesList from '../pages/BannerPackages/index.tsx';
import CreateBannerPackage from '../pages/BannerPackages/CreateBannerPackage';
import EditBannerPackage from '../pages/BannerPackages/EditBannerPackage';
import PendingOrders from '../pages/BannerPackages/PendingOrders';
import BannersList from '../pages/BannerPackages/BannersList';
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => (
  <Routes>
    <Route
      element={
        <MainLayout>
          <Outlet />
        </MainLayout>
      }
    >
      <Route index element={<Dashboard />} />

      <Route path="/accounts" element={<AccountsList />} />
      <Route path="/accounts/create" element={<CreateAccount />} />
      <Route path="/accounts/edit/:id" element={<EditAccount />} />
      <Route path="/accounts/detail/:id" element={<AccountDetail />} />

      <Route path='/jobs' element={<JobsList/>}/>
      <Route path="/jobs/create" element={<CreateJob />} />
      <Route path="/jobs/detail/:id" element={<JobDetail />} />
      <Route path="/jobs/edit/:id" element={<EditJob />} />

      <Route path="/job-categories" element={<JobCategoriesList />} />
      <Route path="/job-categories/create" element={<CreateJobCategory />} />
      <Route path="/job-categories/detail/:id" element={<JobCategoryDetail />} />
      <Route path="/job-categories/edit/:id" element={<EditJobCategory />} />

      <Route path="/roles" element={<RolesList />} />
      <Route path="/roles/create" element={<CreateRole />} />
      <Route path="/roles/detail/:id" element={<RoleDetail />} />
      <Route path="/roles/edit/:id" element={<EditRole />} />

      <Route path="/cv-samples" element={<CVSamplesList />} />
      <Route path="/cv-samples/create" element={<CreateCVSample />} />
      <Route path="/cv-samples/edit/:id" element={<EditCVSample />} />
      <Route path="/cv-samples/:id" element={<CVSampleDetail />} />

      <Route path="/settings" element={<SiteSettingsPage />} />

      <Route path="/blogs" element={<BlogsList />} />
      <Route path="/blogs/create" element={<CreateBlog />} />
      <Route path="/blogs/edit/:id" element={<EditBlog />} />

      <Route path="/job-packages" element={<JobPackagesList />} />
      <Route path="/job-packages/create" element={<CreateJobPackage />} />
      <Route path="/job-packages/edit/:id" element={<EditJobPackage />} />

      <Route path="/banner-packages" element={<BannerPackagesList />} />
      <Route path="/banner-packages/create" element={<CreateBannerPackage />} />
      <Route path="/banner-packages/edit/:id" element={<EditBannerPackage />} />
      <Route path="/banner-packages/:id/pending-orders" element={<PendingOrders />} />
      <Route path="/banner-packages/banners" element={<BannersList />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRouter; 