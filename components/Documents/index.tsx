import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query';
import { DocumentInterface } from '../../interfaces';

function Documents() {
  const router = useRouter();
  const { id: collectionId } = router.query;
  const { data } = useQuery<DocumentInterface[]>('documents', async (): Promise<DocumentInterface[]> => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/documents/collectionId/' + collectionId);
    const response = await res.json();
    return response.data;
  });



  return (
    <div>Documents

      <div className='flex flex-col space-y-1'>
        {data?.map((document, idx) => (
          <div key={idx} className="flex items-center px-2 py-1 rounded-sm border">
            {document.name}
          </div>
        ))}

      </div>
    </div>
  )
}

export default Documents