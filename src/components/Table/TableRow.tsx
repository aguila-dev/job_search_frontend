const TableRow = ({ job }: any) => {
  const handleClick = () => {
    if (job?.absolute_url) {
      console.log('job', job);
      console.log(
        'conveted job.absolute_url',
        new Date(job.absolute_url).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      window.open(job.absolute_url, '_blank');
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const classes = 'p-2';
  return (
    <tr
      onClick={handleClick}
      className={` hover:bg-opacity-85 ${
        job?.absolute_url
          ? 'cursor-pointer hover:bg-slate-300'
          : 'cursor-not-allowed'
      }`}
    >
      <td className={classes}>{job?.company}</td>
      <td className={classes}>{job?.title}</td>
      <td className={classes}>{job?.location?.name}</td>
      <td className={classes}>
        {job?.updated_at ? formatDate(job?.updated_at) : job?.postedOnDate}
      </td>
    </tr>
  );
};

export default TableRow;
