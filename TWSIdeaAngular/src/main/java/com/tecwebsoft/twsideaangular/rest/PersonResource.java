package com.tecwebsoft.twsideaangular.rest;

import com.tecwebsoft.twsideaangular.model.Person;
import com.tecwebsoft.twsideaangular.pagination.PaginatedListWrapper;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

import java.util.List;

/**
 * @author Marcelo Nunes - TWS</br>
 * 		tecwebsoft.com.br - 05/03/2015</br>
 * 		<a href=malito:lopesnunnes@gmail.com>lopesnunnes@gmail.com</a>
 */
@Stateless
@ApplicationPath("/resources")
@Path("persons")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PersonResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    private Integer countPersons() {
        Query query = entityManager.createQuery("SELECT COUNT(p.id) FROM Person p");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Person> findPersons(int startPosition, int maxResults, String sortFields, String sortDirections) {
        Query query =
                entityManager.createQuery("SELECT p FROM Person p ORDER BY p." + sortFields + " " + sortDirections);
        query.setFirstResult(startPosition);
        query.setMaxResults(maxResults);
        return query.getResultList();
    }

    private PaginatedListWrapper findPersons(PaginatedListWrapper wrapper) {
        wrapper.setTotalResults(countPersons());
        int start = (wrapper.getCurrentPage() - 1) * wrapper.getPageSize();
        wrapper.setList(findPersons(start,
                                    wrapper.getPageSize(),
                                    wrapper.getSortFields(),
                                    wrapper.getSortDirections()));
        return wrapper;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PaginatedListWrapper listPersons(@DefaultValue("1")
                                            @QueryParam("page")
                                            Integer page,
                                            @DefaultValue("id")
                                            @QueryParam("sortFields")
                                            String sortFields,
                                            @DefaultValue("asc")
                                            @QueryParam("sortDirections")
                                            String sortDirections) {
        PaginatedListWrapper paginatedListWrapper = new PaginatedListWrapper();
        paginatedListWrapper.setCurrentPage(page);
        paginatedListWrapper.setSortFields(sortFields);
        paginatedListWrapper.setSortDirections(sortDirections);
        paginatedListWrapper.setPageSize(10);
        return findPersons(paginatedListWrapper);
    }

    @GET
    @Path("{id}")
    public Person getPerson(@PathParam("id") Long id) {
        return entityManager.find(Person.class, id);
    }

    @POST
    public Person savePerson(Person person) {
        if (person.getId() == null) {
            Person personToSave = new Person();
            personToSave.setName(person.getName());
            personToSave.setDescription(person.getDescription());
            entityManager.persist(person);
        } else {
            Person personToUpdate = getPerson(person.getId());
            personToUpdate.setName(person.getName());
            personToUpdate.setDescription(person.getDescription());
            person = entityManager.merge(personToUpdate);
        }

        return person;
    }

    @DELETE
    @Path("{id}")
    public void deletePerson(@PathParam("id") Long id) {
        entityManager.remove(getPerson(id));
    }
}
