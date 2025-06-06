import TechDetails from '../../components/TechDetails'; // Adjusted path due to [id] subdirectory

// This page is rendered for dynamic routes like '/tech/some-id'
// The [id].jsx filename makes the 'id' parameter available via useRouter or useParams
function TechDetailPage() {
  return <TechDetails />;
}

export default TechDetailPage; 