import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Today from './pages/Today';
import Review from './pages/Review';
import LiteratureLibrary from './pages/academic/LiteratureLibrary';
import TheoryLibrary from './pages/academic/TheoryLibrary';
import MethodLibrary from './pages/academic/MethodLibrary';
import ShortPapers from './pages/papers/ShortPapers';
import ThesisPage from './pages/papers/ThesisPage';
import ResearchIdeas from './pages/papers/ResearchIdeas';
import PolicyLibrary from './pages/industry/PolicyLibrary';
import CaseLibrary from './pages/industry/CaseLibrary';
import ReportWriting from './pages/industry/ReportWriting';
import ReadingNotes from './pages/industry/ReadingNotes';
import FinancePage from './pages/learning/FinancePage';
import LanguagesPage from './pages/learning/LanguagesPage';
import EcommercePage from './pages/learning/EcommercePage';
import WechatPage from './pages/learning/WechatPage';
import VideoPage from './pages/learning/VideoPage';
import HealthPage from './pages/learning/HealthPage';
import CalendarTasks from './pages/CalendarTasks';
import GlobalLibrary from './pages/GlobalLibrary';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Today />} />
          <Route path="/review" element={<Review />} />
          <Route path="/academic/literature" element={<LiteratureLibrary />} />
          <Route path="/academic/theory" element={<TheoryLibrary />} />
          <Route path="/academic/method" element={<MethodLibrary />} />
          <Route path="/papers/short" element={<ShortPapers />} />
          <Route path="/papers/thesis" element={<ThesisPage />} />
          <Route path="/papers/ideas" element={<ResearchIdeas />} />
          <Route path="/industry/policies" element={<PolicyLibrary />} />
          <Route path="/industry/cases" element={<CaseLibrary />} />
          <Route path="/industry/reports" element={<ReportWriting />} />
          <Route path="/industry/notes" element={<ReadingNotes />} />
          <Route path="/learning/finance" element={<FinancePage />} />
          <Route path="/learning/languages" element={<LanguagesPage />} />
          <Route path="/learning/ecommerce" element={<EcommercePage />} />
          <Route path="/learning/wechat" element={<WechatPage />} />
          <Route path="/learning/video" element={<VideoPage />} />
          <Route path="/learning/health" element={<HealthPage />} />
          <Route path="/calendar" element={<CalendarTasks />} />
          <Route path="/library" element={<GlobalLibrary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
